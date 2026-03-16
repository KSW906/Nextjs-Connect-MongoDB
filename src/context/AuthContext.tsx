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
  updateUser: (updates: Partial<User>) => Promise<{ success: boolean; message?: string }>
  deleteAccount: (password: string) => Promise<{ success: boolean; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Get users from localStorage
    const usersStr = localStorage.getItem('users')
    const users: Array<User & { password: string }> = usersStr ? JSON.parse(usersStr) : []

    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' }
  }

  const logout = () => {
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

    // Check for duplicate email
    const usersStr = localStorage.getItem('users')
    const users: Array<User & { password: string }> = usersStr ? JSON.parse(usersStr) : []

    if (users.some((u) => u.email === email)) {
      return { success: false, message: '이미 사용 중인 이메일입니다.' }
    }

    // Create new user
    const isAdminAccount = email.startsWith('admin@') || email === 'admin@plantshop.com';
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      password,
      name,
      phone,
      isAdmin: isAdminAccount,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const updateUser = async (updates: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: '로그인이 필요합니다.' }

    const usersStr = localStorage.getItem('users')
    const users: Array<User & { password: string }> = usersStr ? JSON.parse(usersStr) : []

    const userIndex = users.findIndex((u) => u.id === user.id)
    if (userIndex === -1) return { success: false, message: '사용자를 찾을 수 없습니다.' }

    const updatedUser = { ...users[userIndex], ...updates }
    users[userIndex] = updatedUser
    localStorage.setItem('users', JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = updatedUser
    setUser(userWithoutPassword)
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))

    return { success: true }
  }

  const deleteAccount = async (password: string): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: '로그인이 필요합니다.' }

    const usersStr = localStorage.getItem('users')
    const users: Array<User & { password: string }> = usersStr ? JSON.parse(usersStr) : []

    const foundUser = users.find((u) => u.id === user.id && u.password === password)
    if (!foundUser) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' }
    }

    const filteredUsers = users.filter((u) => u.id !== user.id)
    localStorage.setItem('users', JSON.stringify(filteredUsers))

    logout()
    return { success: true }
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
