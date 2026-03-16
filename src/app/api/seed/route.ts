import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'

/**
 * 간단한 샘플 데이터(더미)를 MongoDB에 넣어보는 API입니다.
 * 개발 환경에서만 사용하세요.
 *
 * 호출: GET /api/seed
 */
export async function GET() {
  await dbConnect()

  // 기존 데이터를 초기화하고 싶다면 아래 주석을 해제하세요.
  // await User.deleteMany({})

  const dummyUsers = [
    {
      email: 'alice@example.com',
      nickname: 'alice',
      profile_image_url: 'https://i.pravatar.cc/150?u=alice',
      user_type: 'user',
    },
    {
      email: 'bob@example.com',
      nickname: 'bob',
      profile_image_url: 'https://i.pravatar.cc/150?u=bob',
      user_type: 'admin',
    },
    {
      email: 'carol@example.com',
      nickname: 'carol',
      profile_image_url: 'https://i.pravatar.cc/150?u=carol',
      user_type: 'user',
    },
  ]

  const createdUsers = await User.insertMany(dummyUsers, { ordered: false })

  return NextResponse.json(
    {
      message: 'Dummy users inserted.',
      insertedCount: createdUsers.length,
      users: createdUsers.map((u) => ({
        email: u.email,
        nickname: u.nickname,
        profile_image_url: u.profile_image_url,
        user_type: u.user_type,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
    },
    { status: 201 }
  )
}
