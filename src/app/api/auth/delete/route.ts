import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: '유저 ID가 필요합니다.' }, { status: 400 })
    }

    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ success: false, message: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    await User.findByIdAndDelete(id)

    return NextResponse.json({ success: true, message: '계정이 삭제되었습니다.' }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '계정 삭제 중 오류가 발생했습니다.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
