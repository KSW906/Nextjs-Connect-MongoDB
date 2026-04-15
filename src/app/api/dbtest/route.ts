import { NextResponse } from 'next/server'
import dbConnect from '@/db/dbConnect'

export async function GET() {
  try {
    const conn = await dbConnect()
    return NextResponse.json({ success: true, database: conn.db?.databaseName ?? null })
  } catch (error) {
    console.error('DB connect error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
