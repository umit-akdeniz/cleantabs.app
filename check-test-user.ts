import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking test user in database...')
  
  try {
    // Check if the test user exists
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@test.com' },
    })

    if (testUser) {
      console.log('✅ Test user found:', {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        plan: testUser.plan,
        createdAt: testUser.createdAt,
        hasPassword: !!testUser.password
      })

      // Check if password is correct
      if (testUser.password) {
        const isPasswordValid = await bcrypt.compare('test123', testUser.password)
        console.log('🔐 Password check:', isPasswordValid ? '✅ Valid' : '❌ Invalid')
        
        if (!isPasswordValid) {
          console.log('🔧 Current password hash:', testUser.password)
          console.log('🔧 Expected password: test123')
          
          // Generate new hash for comparison
          const newHash = await bcrypt.hash('test123', 12)
          console.log('🔧 New hash would be:', newHash)
          
          // Ask if user wants to update password
          console.log('\n❓ Password mismatch detected. Would you like to update it?')
          console.log('   Run: npm run tsx check-test-user.ts -- --update-password')
        }
      } else {
        console.log('⚠️  Test user exists but has no password set')
        console.log('   Run: npm run tsx check-test-user.ts -- --set-password')
      }
    } else {
      console.log('❌ Test user not found')
      console.log('   Run: npm run tsx check-test-user.ts -- --create-user')
    }

    // Check command line arguments
    const args = process.argv.slice(2)
    
    if (args.includes('--create-user')) {
      await createTestUser()
    } else if (args.includes('--update-password') || args.includes('--set-password')) {
      await updateTestUserPassword()
    }

  } catch (error) {
    console.error('❌ Database error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('\n🔧 Database connection refused. Check if:')
        console.log('   1. Database server is running')
        console.log('   2. DATABASE_URL is correctly set in .env')
        console.log('   3. Database exists and is accessible')
      } else if (error.message.includes('DATABASE_URL')) {
        console.log('\n🔧 DATABASE_URL issue. Check your .env file')
      } else if (error.message.includes('schema')) {
        console.log('\n🔧 Database schema issue. Try running:')
        console.log('   npx prisma db push')
        console.log('   or')
        console.log('   npx prisma migrate deploy')
      }
    }
  } finally {
    await prisma.$disconnect()
  }
}

async function createTestUser() {
  console.log('\n🔨 Creating test user...')
  
  try {
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    const user = await prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User',
        password: hashedPassword,
        plan: 'FREE',
      },
    })

    console.log('✅ Test user created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    })
  } catch (error) {
    console.error('❌ Failed to create test user:', error)
  }
}

async function updateTestUserPassword() {
  console.log('\n🔨 Updating test user password...')
  
  try {
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    const user = await prisma.user.update({
      where: { email: 'test@test.com' },
      data: { password: hashedPassword },
    })

    console.log('✅ Test user password updated successfully')
    
    // Verify the update
    const isPasswordValid = await bcrypt.compare('test123', user.password!)
    console.log('🔐 Password verification:', isPasswordValid ? '✅ Valid' : '❌ Invalid')
  } catch (error) {
    console.error('❌ Failed to update test user password:', error)
  }
}

// Additional diagnostic function
async function checkDatabaseConnection() {
  console.log('\n🔍 Checking database connection...')
  
  try {
    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful:', result)
    
    // Check if User table exists
    const userCount = await prisma.user.count()
    console.log(`✅ User table accessible. Total users: ${userCount}`)
    
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Run diagnostics if requested
if (process.argv.includes('--diagnostics')) {
  checkDatabaseConnection().then(() => {
    main()
  })
} else {
  main()
}