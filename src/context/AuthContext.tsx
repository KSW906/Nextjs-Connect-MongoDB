'use client';

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  signup: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<{ success: boolean; message?: string }>
  updateUser: (updates: Partial<User> & { password?: string }) => Promise<{ success: boolean; message?: string }>
  deleteAccount: () => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage and restore the server session cookie if needed.
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parsedUser.id }),
      }).catch(() => undefined)
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true };
      }
      
      return { success: false, message: data.message || '이메일 또는 비밀번호가 일치하지 않습니다.' };
    } catch (error) {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' };
    }
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ): Promise<{ success: boolean; message?: string }> => {
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: '올바른 이메일 형식이 아닙니다.' }
    }

    // Validate password
    if (password.length < 8) {
      return { success: false, message: '비밀번호는 8자 이상이어야 합니다.' }
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(password)) {
      return { success: false, message: '비밀번호는 영문과 숫자 조합이어야 합니다.' }
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return { success: true };
      }
      
      return { success: false, message: data.message || '회원가입에 실패했습니다.' };
    } catch (error) {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' };
    }
  }

  const updateUser = async (updates: Partial<User> & { password?: string }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: '로그인이 필요합니다.' }

    try {
      const response = await fetch('/api/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...updates }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '회원정보 수정에 실패했습니다.' }
      }

      setUser(data.user)
      localStorage.setItem('currentUser', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const deleteAccount = async (): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: '로그인이 필요합니다.' }

    try {
      const response = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '계정 삭제에 실패했습니다.' }
      }

      logout()
      return { success: true }
    } catch (error) {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, updateUser, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
