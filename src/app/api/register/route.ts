import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { handleDatabaseError, withDatabaseRetry } from '@/lib/api-utils';

export async function POST(request: Request) {
  try {
    console.log('Register API called');
    const { name, email, password } = await request.json();
    console.log('Received data:', { name, email });

    // Database operations with improved error handling
    return await withDatabaseRetry(async () => {
      // Check if user already exists
      console.log('Checking existing user...');
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      console.log('Existing user check complete');

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 400 }
        );
      }

      // Hash password
      console.log('Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log('Password hashed');

      // Create user
      console.log('Creating user...');
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          plan: 'FREE',
          emailVerified: new Date() // Auto-verify for simplicity
        }
      });
      console.log('User created:', user.id);

      // Remove password from response
      const { password: _, ...userWithoutSensitiveData } = user;

      return NextResponse.json({
        ...userWithoutSensitiveData,
        message: 'Account created successfully!'
      });
    }, 'register user');
  } catch (error: any) {
    return handleDatabaseError(error, 'register');
  }
}