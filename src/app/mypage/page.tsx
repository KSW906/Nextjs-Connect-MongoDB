'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Heart, Package, MessageSquare, User as UserIcon, Trash2, Leaf, Star } from 'lucide-react'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function MyPage() {
  const router = useRouter()
  const { user, updateUser, deleteAccount } = useAuth()
  const { orders, products, wishlist, toggleWishlist, cancelOrder, reviews, addToCart, updateReview, deleteReview } =
    useShop()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [newPassword, setNewPassword] = useState('')
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editingReviewContent, setEditingReviewContent] = useState('')
  const [editingReviewRating, setEditingReviewRating] = useState(5)
  const [isSavingReview, setIsSavingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  const userOrders = orders.filter((o) => o.userId === user.id)
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id))
  const userReviews = reviews.filter((r) => r.userId === user.id)

  const purchasedProducts = Array.from(
    new Set(userOrders.filter((o) => o.status !== 'cancelled').flatMap((o) => o.items.map((item) => item.productId)))
  )
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is import('@/types').Product => p !== undefined)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim()) {
      toast.error('이름과 연락처를 입력해 주세요.')
      return
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        toast.error('비밀번호는 8자 이상이어야 합니다.')
        return
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(newPassword)) {
        toast.error('비밀번호는 영문과 숫자를 포함해야 합니다.')
        return
      }
    }

    const updates: { name: string; phone: string; password?: string } = { name, phone }
    if (newPassword) updates.password = newPassword

    const result = await updateUser(updates)
    if (result.success) {
      toast.success('회원정보를 수정했습니다.')
      setNewPassword('')
    } else {
      toast.error(result.message)
    }
  }

  const handleDeleteAccount = async () => {
    const result = await deleteAccount()
    if (result.success) {
      toast.success('계정을 삭제했습니다.')
      router.push('/')
    } else {
      toast.error(result.message)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    const result = await cancelOrder(orderId)
    if (result.success) {
      toast.success('주문을 취소했습니다.')
    } else {
      toast.error('배송 중이거나 완료된 주문은 취소할 수 없습니다.')
    }
  }

  const handleStartEditReview = (review: { id: string; content: string; rating: number }) => {
    setEditingReviewId(review.id)
    setEditingReviewContent(review.content)
    setEditingReviewRating(review.rating)
  }

  const resetReviewEdit = () => {
    setEditingReviewId(null)
    setEditingReviewContent('')
    setEditingReviewRating(5)
  }

  const handleSaveReview = async () => {
    if (!editingReviewId) return
    if (!editingReviewContent.trim()) {
      toast.error('리뷰 내용을 입력해 주세요.')
      return
    }

    setIsSavingReview(true)
    try {
      const result = await updateReview(editingReviewId, editingReviewContent, editingReviewRating)
      if (result.success) {
        toast.success('리뷰를 수정했습니다.')
        resetReviewEdit()
      } else {
        toast.error(result.message)
      }
    } finally {
      setIsSavingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('이 리뷰를 삭제할까요?')) {
      return
    }

    setDeletingReviewId(reviewId)
    try {
      const result = await deleteReview(reviewId)
      if (result.success) {
        if (editingReviewId === reviewId) {
          resetReviewEdit()
        }
        toast.success('리뷰를 삭제했습니다.')
      } else {
        toast.error(result.message)
      }
    } finally {
      setDeletingReviewId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      pending: { label: '결제대기', variant: 'secondary' },
      paid: { label: '결제완료', variant: 'default' },
      shipping: { label: '배송중', variant: 'default' },
      delivered: { label: '배송완료', variant: 'default' },
      cancelled: { label: '취소됨', variant: 'destructive' },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold">마이페이지</h1>

        <Tabs defaultValue="my-plants" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-5">
            <TabsTrigger value="my-plants" className="gap-2">
              <Leaf className="h-4 w-4" />내 식물
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              주문내역
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" />찜 목록
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              리뷰
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <UserIcon className="h-4 w-4" />
              회원정보
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-plants">
            {purchasedProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Leaf className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-gray-600">아직 분양받은 식물이 없습니다</p>
                  <Button onClick={() => router.push('/')}>새로운 식물 만나러 가기</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {purchasedProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => router.push(`/product/${product.id}`)}
                      />
                    </div>
                    <CardContent className="flex flex-1 flex-col p-4 text-center">
                      <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                      <p className="mb-4 line-clamp-2 whitespace-pre-line text-sm text-gray-600">
                        {product.careInstructions || '매주 1회 흙이 마르면 물을 흠뻑 주세요.'}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-auto w-full"
                        onClick={() => router.push(`/product/${product.id}`)}
                      >
                        상세 정보 보기
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="mb-4 text-gray-600">주문 내역이 없습니다</p>
                    <Button onClick={() => router.push('/')}>쇼핑하러 가기</Button>
                  </CardContent>
                </Card>
              ) : (
                userOrders.map((order) => {
                  const orderItems = order.items.map((item) => ({
                    ...item,
                    product: {
                      image: item.productImage,
                      name: item.productName,
                      price: item.unitPrice,
                    },
                  }))

                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2 text-lg">주문번호: {order.id}</CardTitle>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {orderItems.map((item) => (
                            <div key={item.productId} className="flex gap-4">
                              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <ImageWithFallback
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  {item.product.price.toLocaleString()}원 x {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}

                          <div className="flex items-center justify-between border-t pt-4">
                            <div>
                              <p className="font-semibold">총 결제금액: {order.total.toLocaleString()}원</p>
                              <p className="text-sm text-gray-600">
                                예상 배송일: {new Date(order.estimatedDelivery).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            {order.status === 'paid' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    주문 취소
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>주문을 취소하시겠습니까?</AlertDialogTitle>
                                    <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>취소</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>
                                      확인
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            {wishlistProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="mb-4 text-gray-600">찜한 상품이 없습니다</p>
                  <Button onClick={() => router.push('/')}>쇼핑하러 가기</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistProducts.map((product) => (
                  <Card key={product.id}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full cursor-pointer object-cover"
                        onClick={() => router.push(`/product/${product.id}`)}
                      />
                      <button
                        onClick={async () => {
                          const result = await toggleWishlist(product.id)
                          if (result.success) {
                            toast.success('찜 목록에서 제거했습니다.')
                          } else {
                            toast.error(result.message)
                          }
                        }}
                        className="absolute right-2 top-2 rounded-full bg-white/80 p-2 hover:bg-white"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-semibold">{product.name}</h3>
                      <p className="mb-4 text-lg font-semibold text-green-700">{product.price.toLocaleString()}원</p>
                      <Button
                        className="w-full"
                        onClick={async () => {
                          const result = await addToCart(product.id)
                          if (result.success) {
                            toast.success('장바구니에 추가되었습니다')
                          } else {
                            toast.error(result.message)
                          }
                        }}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? '품절' : '장바구니 담기'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {userReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="mb-4 text-gray-600">작성한 리뷰가 없습니다</p>
                    <Button onClick={() => router.push('/')}>쇼핑하러 가기</Button>
                  </CardContent>
                </Card>
              ) : (
                userReviews.map((review) => {
                  const product = products.find((p) => p.id === review.productId)
                  if (!product) return null

                  const isEditing = editingReviewId === review.id
                  const isDeleting = deletingReviewId === review.id

                  return (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div
                            className="h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-gray-100"
                            onClick={() => router.push(`/product/${product.id}`)}
                          >
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between gap-4">
                              <div>
                                <h3
                                  className="mb-2 cursor-pointer font-semibold hover:text-green-700"
                                  onClick={() => router.push(`/product/${product.id}`)}
                                >
                                  {product.name}
                                </h3>
                                <div className="mb-2 flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= (isEditing ? editingReviewRating : review.rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="mb-2 text-sm text-gray-600">
                                  {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                {!isEditing ? (
                                  <>
                                    <Button variant="ghost" size="sm" onClick={() => handleStartEditReview(review)}>
                                      수정
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => void handleDeleteReview(review.id)}
                                      disabled={isDeleting}
                                    >
                                      {isDeleting ? '삭제 중...' : '삭제'}
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => void handleSaveReview()}
                                      disabled={isSavingReview}
                                    >
                                      {isSavingReview ? '저장 중...' : '저장'}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={resetReviewEdit}
                                      disabled={isSavingReview}
                                    >
                                      취소
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="space-y-3">
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} type="button" onClick={() => setEditingReviewRating(star)}>
                                      <Star
                                        className={`h-5 w-5 ${
                                          star <= editingReviewRating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <Textarea
                                  value={editingReviewContent}
                                  onChange={(e) => setEditingReviewContent(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            ) : (
                              <p className="text-gray-700">{review.content}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>회원정보 수정</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input id="email" value={user.email} disabled />
                      <p className="mt-1 text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
                    </div>
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">연락처</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">새 비밀번호</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="8자 이상, 영문+숫자"
                      />
                    </div>
                    <Button type="submit">저장</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">회원 탈퇴</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.</p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        회원 탈퇴
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>모든 정보가 삭제되며 복구할 수 없습니다.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                          탈퇴하기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
