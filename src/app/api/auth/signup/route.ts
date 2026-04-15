import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import { applyAuthCookie, createAuthToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { email, password, name, phone } = body

    if (!email || !password || !name || !phone) {
      return NextResponse.json({ success: false, message: '모든 필드를 입력해주세요.' }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: '이미 사용 중인 이메일입니다.' }, { status: 400 })
    }

    const isAdminAccount = email.startsWith('admin@') || email === 'admin@plantshop.com'
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      isAdmin: isAdminAccount,
    })

    const userObj = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
      createdAt: newUser.createdAt.toISOString(),
    }

    const response = NextResponse.json({ success: true, user: userObj }, { status: 201 })
    applyAuthCookie(response, createAuthToken({ userId: newUser._id.toString() }))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
