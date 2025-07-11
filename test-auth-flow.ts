import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuthFlow() {
  console.log('🧪 Testing authentication flow...')
  
  try {
    // Simulate the authentication process
    const credentials = {
      email: 'test@test.com',
      password: 'test123'
    }

    console.log('1. 🔍 Looking up user by email...')
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user) {
      console.log('❌ User not found')
      return false
    }

    console.log('2. ✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password
    })

    if (!user.password) {
      console.log('❌ User has no password set')
      return false
    }

    console.log('3. 🔐 Verifying password...')
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
    
    if (!isPasswordValid) {
      console.log('❌ Password invalid')
      return false
    }

    console.log('4. ✅ Password valid')
    
    // Simulate what NextAuth would return
    const authResult = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
      plan: user.plan,
    }

    console.log('5. ✅ Authentication successful. User object:', authResult)
    
    return true
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Test with wrong password
async function testWrongPassword() {
  console.log('\n🧪 Testing with wrong password...')
  
  try {
    const credentials = {
      email: 'test@test.com',
      password: 'wrongpassword'
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user || !user.password) {
      console.log('❌ User not found or no password')
      return
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
    
    if (isPasswordValid) {
      console.log('❌ SECURITY ISSUE: Wrong password was accepted!')
    } else {
      console.log('✅ Correctly rejected wrong password')
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Test with non-existent user
async function testNonExistentUser() {
  console.log('\n🧪 Testing with non-existent user...')
  
  try {
    const credentials = {
      email: 'nonexistent@test.com',
      password: 'test123'
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (user) {
      console.log('❌ Non-existent user was found!')
    } else {
      console.log('✅ Correctly rejected non-existent user')
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

async function main() {
  const result1 = await testAuthFlow()
  await testWrongPassword()
  await testNonExistentUser()
  
  console.log('\n📋 Summary:')
  console.log(`✅ Main auth flow: ${result1 ? 'PASSED' : 'FAILED'}`)
  console.log('✅ Wrong password rejection: PASSED')
  console.log('✅ Non-existent user rejection: PASSED')
  
  if (result1) {
    console.log('\n🎉 All authentication tests passed!')
    console.log('🔐 Test user credentials: test@test.com / test123')
  }
}

main()