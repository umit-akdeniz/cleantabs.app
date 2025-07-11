import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('Signup API called');
    const { name, email, password } = await request.json();
    console.log('Received data:', { name, email });

    // Test database connection first
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected');

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
  } catch (error: any) {
    console.error('Signup error details:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json(
      { error: `Internal server error: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}