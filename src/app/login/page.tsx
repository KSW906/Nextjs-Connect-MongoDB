'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type StoredUser = {
  email: string
  isAdmin?: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const { login, signup } = useAuth()

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Signup form
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupPhone, setSignupPhone] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await login(loginEmail, loginPassword)
    if (result.success) {
      toast.success('로그인되었습니다')
      router.push('/')
    } else {
      toast.error(result.message || '로그인에 실패했습니다')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password confirmation
    if (signupPassword !== signupPasswordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다')
      return
    }

    const result = await signup(signupEmail, signupPassword, signupName, signupPhone)
    if (result.success) {
      toast.success('회원가입이 완료되었습니다')
      router.push('/')
    } else {
      toast.error(result.message || '회원가입에 실패했습니다')
    }
  }

  // Create admin account for demo
  const createAdminAccount = async () => {
    const result = await signup('admin@plantshop.com', 'admin1234', '관리자', '010-0000-0000')
    if (result.success) {
      // Update to admin
      const usersStr = localStorage.getItem('users')
      const users = usersStr ? (JSON.parse(usersStr) as StoredUser[]) : []
      const adminUser = users.find((u) => u.email === 'admin@plantshop.com')
      if (adminUser) {
        adminUser.isAdmin = true
        localStorage.setItem('users', JSON.stringify(users))
      }
      toast.success('관리자 계정이 생성되었습니다\n이메일: admin@plantshop.com\n비밀번호: admin1234')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl">🌿</div>
          <h1 className="text-2xl font-bold text-green-700">PlantShop</h1>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">로그인</TabsTrigger>
            <TabsTrigger value="signup">회원가입</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>로그인</CardTitle>
                <CardDescription>이메일과 비밀번호를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">이메일</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">비밀번호</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    로그인
                  </Button>
                </form>

                <div className="mt-4 border-t pt-4">
                  <p className="mb-2 text-sm text-gray-600">데모용 계정:</p>
                  <Button variant="outline" size="sm" onClick={createAdminAccount} className="w-full">
                    관리자 계정 생성
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>새 계정을 만들어보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">이메일</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">비밀번호</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      placeholder="8자 이상, 영문+숫자"
                    />
                    <p className="mt-1 text-xs text-gray-500">8자 이상, 영문+숫자 조합</p>
                  </div>
                  <div>
                    <Label htmlFor="signup-password-confirm">비밀번호 확인</Label>
                    <Input
                      id="signup-password-confirm"
                      type="password"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-name">이름</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-phone">연락처</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      required
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    회원가입
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-green-700">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
