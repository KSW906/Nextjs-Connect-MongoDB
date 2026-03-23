import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'plantshop_auth'
const DEFAULT_JWT_SECRET = 'dev-secret-change-me'

type SessionPayload = {
  userId: string
}

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET
}

export function createAuthToken(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

export async function getSessionUserId() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as SessionPayload
    return decoded.userId
  } catch {
    return null
  }
}

export function applyAuthCookie(response: Response, token: string) {
  const nextResponse = response as unknown as {
    cookies: {
      set(name: string, value: string, options: Record<string, unknown>): void
    }
  }

  nextResponse.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearAuthCookie(response: Response) {
  const nextResponse = response as unknown as {
    cookies: {
      set(name: string, value: string, options: Record<string, unknown>): void
    }
  }

  nextResponse.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
