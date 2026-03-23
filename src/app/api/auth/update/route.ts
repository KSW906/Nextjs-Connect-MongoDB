import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id, name, phone, password } = body

    if (!id) {
      return NextResponse.json({ success: false, message: '유저 ID가 필요합니다.' }, { status: 400 })
    }

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ success: false, message: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (name) user.name = name
    if (phone) user.phone = phone
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ success: false, message: '비밀번호는 8자 이상이어야 합니다.' }, { status: 400 })
      }
      user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    return NextResponse.json(
      {
        success: true,
        user: {
          id: updatedUser._id.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          isAdmin: updatedUser.isAdmin,
          createdAt: updatedUser.createdAt.toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : '회원정보 수정 중 오류가 발생했습니다.'
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
