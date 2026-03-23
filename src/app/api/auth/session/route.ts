import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'
import User from '@/db/models/user'
import { applyAuthCookie, createAuthToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required.' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
    }

    const response = NextResponse.json({ success: true }, { status: 200 })
    applyAuthCookie(response, createAuthToken({ userId: user._id.toString() }))
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to restore session.'
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
