import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseBookmarkFile, convertToCategories, detectBookmarkFileType } from '@/lib/bookmarkImporter';

// Generate unique ID with prefix
function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}${timestamp}${random}`;
}

// Check plan limits
async function checkPlanLimits(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      categories: {
        include: {
          subcategories: {
            include: {
              sites: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPremium = user.plan === 'PREMIUM';
  const totalCategories = user.categories.length;
  const totalSubcategories = user.categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
  const totalSites = user.categories.reduce((sum, cat) => 
    sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.sites.length, 0), 0
  );

  return {
    isPremium,
    limits: {
      categories: isPremium ? 100 : 5,
      subcategories: isPremium ? 500 : 15,
      sites: isPremium ? 5000 : 50
    },
    current: {
      categories: totalCategories,
      subcategories: totalSubcategories,
      sites: totalSites
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const options = JSON.parse(formData.get('options') as string || '{}');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();
    
    // Basic validation
    if (!fileContent || fileContent.length < 10) {
      return NextResponse.json({ 
        error: 'File appears to be empty or corrupted.' 
      }, { status: 400 });
    }

    // Detect and validate file type
    const fileType = detectBookmarkFileType(fileContent);
    if (fileType === 'unknown') {
      return NextResponse.json({ 
        error: 'Unsupported file format. Please upload HTML or JSON bookmark file.' 
      }, { status: 400 });
    }

    // Parse bookmarks with error handling
    let parsed: any;
    try {
      parsed = parseBookmarkFile(fileContent);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return NextResponse.json({ 
        error: 'Failed to parse bookmark file. Please check the file format.' 
      }, { status: 400 });
    }
    
    if (parsed.totalBookmarks === 0) {
      return NextResponse.json({ 
        error: 'No bookmarks found in the file.' 
      }, { status: 400 });
    }

    // Convert to categories
    const browserType = fileType === 'json' ? 'firefox' : 
      (file.name.toLowerCase().includes('firefox') ? 'firefox' : 'chrome');
    const categories = convertToCategories(parsed, browserType);

    // Check plan limits
    const planInfo = await checkPlanLimits(user.id);
    const newCategoriesCount = categories.length;
    const newSubcategoriesCount = categories.reduce((sum, cat) => sum + cat.subcategories.length, 0);
    const newSitesCount = categories.reduce((sum, cat) => 
      sum + cat.subcategories.reduce((subSum, sub) => subSum + sub.sites.length, 0), 0
    );

    if (planInfo.current.categories + newCategoriesCount > planInfo.limits.categories ||
        planInfo.current.subcategories + newSubcategoriesCount > planInfo.limits.subcategories ||
        planInfo.current.sites + newSitesCount > planInfo.limits.sites) {
      
      return NextResponse.json({
        error: 'Plan limit exceeded',
        planInfo,
        required: {
          categories: newCategoriesCount,
          subcategories: newSubcategoriesCount,
          sites: newSitesCount
        }
      }, { status: 402 });
    }

    // Create categories and subcategories
    let categoriesCreated = 0;
    let subcategoriesCreated = 0;
    let sitesCreated = 0;
    const errors: string[] = [];

    for (const category of categories) {
      try {
        // Create category
        const createdCategory = await prisma.category.create({
          data: {
            id: generateId('cat-'),
            name: category.name,
            icon: category.icon,
            userId: user.id,
            order: planInfo.current.categories + categoriesCreated
          }
        });
        categoriesCreated++;

        // Create subcategories
        for (let subIdx = 0; subIdx < category.subcategories.length; subIdx++) {
          const subcategory = category.subcategories[subIdx];
          
          try {
            const createdSubcategory = await prisma.subcategory.create({
              data: {
                id: generateId('sub-'),
                name: subcategory.name,
                icon: subcategory.icon,
                categoryId: createdCategory.id,
                order: subIdx
              }
            });
            subcategoriesCreated++;

            // Create sites
            for (let siteIdx = 0; siteIdx < subcategory.sites.length; siteIdx++) {
              const site = subcategory.sites[siteIdx];
              
              try {
                await prisma.site.create({
                  data: {
                    id: generateId('site-'),
                    name: site.name,
                    url: site.url,
                    description: site.description,
                    favicon: site.favicon,
                    subcategoryId: createdSubcategory.id,
                    order: siteIdx,
                    reminderEnabled: false
                  }
                });
                sitesCreated++;
              } catch (error) {
                console.error('Error creating site:', error);
                errors.push(`Failed to create site: ${site.name}`);
              }
            }
          } catch (error) {
            console.error('Error creating subcategory:', error);
            errors.push(`Failed to create subcategory: ${subcategory.name}`);
          }
        }
      } catch (error) {
        console.error('Error creating category:', error);
        errors.push(`Failed to create category: ${category.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${sitesCreated} bookmarks`,
      stats: {
        categoriesCreated,
        subcategoriesCreated,
        sitesCreated,
        totalBookmarks: parsed.totalBookmarks,
        totalFolders: parsed.totalFolders
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Import failed' 
    }, { status: 500 });
  }
}