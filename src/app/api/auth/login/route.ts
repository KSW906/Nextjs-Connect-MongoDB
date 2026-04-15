import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import { applyAuthCookie, createAuthToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: '가입되지 않은 이메일입니다.' }, { status: 401 })
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      return NextResponse.json({ success: false, message: '비밀번호가 일치하지 않습니다.' }, { status: 401 })
    }

    const userObj = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
    }

    const response = NextResponse.json({ success: true, user: userObj }, { status: 200 })
    applyAuthCookie(response, createAuthToken({ userId: user._id.toString() }))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
