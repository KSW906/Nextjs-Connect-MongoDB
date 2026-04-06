'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react'
import { toast } from 'sonner'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { useAuth } from '@/context/AuthContext'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveRecentViewedProduct } from '@/lib/recentViewed'

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { user } = useAuth()
  const { getProductById, addToCart, wishlist, toggleWishlist, reviews, addReview, deleteReview, updateReview } =
    useShop()

  const [quantity, setQuantity] = useState(1)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null)
  const reviewFormRef = useRef<HTMLDivElement | null>(null)

  const product = id ? getProductById(id) : undefined
  const productReviews = reviews.filter((r) => r.productId === id)
  const averageRating =
    productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : 0

  useEffect(() => {
    if (editingReviewId) {
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [editingReviewId])

  useEffect(() => {
    if (!product) return
    saveRecentViewedProduct(product)
  }, [product])

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="mb-4 text-lg text-gray-600">상품을 찾을 수 없습니다.</p>
        <Button onClick={() => router.push('/')}>홈으로 돌아가기</Button>
      </div>
    )
  }

  const isWishlisted = wishlist.includes(product.id)
  const isOutOfStock = product.stock === 0

  const resetReviewForm = () => {
    setEditingReviewId(null)
    setReviewContent('')
    setReviewRating(5)
  }

  const handleAddToCart = async () => {
    if (isOutOfStock) return

    if (!user) {
      toast.error('로그인한 사용자만 장바구니를 이용할 수 있습니다.')
      router.push('/login')
      return
    }

    const result = await addToCart(product.id, quantity)
    if (result.success) {
      toast.success(`${product.name} ${quantity}개를 장바구니에 담았습니다.`)
    } else {
      toast.error(result.message)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('로그인한 사용자만 찜할 수 있습니다.')
      router.push('/login')
      return
    }

    const result = await toggleWishlist(product.id)
    if (result.success) {
      toast.success(isWishlisted ? '찜 목록에서 제거되었습니다.' : '찜 목록에 추가되었습니다.')
    } else {
      toast.error(result.message)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }

    if (!reviewContent.trim()) {
      toast.error('리뷰 내용을 입력해 주세요.')
      return
    }

    setIsSubmittingReview(true)
    try {
      if (editingReviewId) {
        const result = await updateReview(editingReviewId, reviewContent, reviewRating)
        if (!result.success) {
          toast.error(result.message)
          return
        }
        toast.success('리뷰를 수정했습니다.')
      } else {
        const result = await addReview({
          userId: user.id,
          productId: product.id,
          rating: reviewRating,
          content: reviewContent,
        })
        if (!result.success) {
          toast.error(result.message)
          return
        }
        toast.success('리뷰를 작성했습니다.')
      }

      resetReviewForm()
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleEditReview = (review: { id: string; content: string; rating: number }) => {
    setEditingReviewId(review.id)
    setReviewContent(review.content)
    setReviewRating(review.rating)
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
          resetReviewForm()
        }
        toast.success('리뷰를 삭제했습니다.')
      } else {
        toast.error(result.message)
      }
    } finally {
      setDeletingReviewId(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로가기
        </Button>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <ImageWithFallback src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="text-2xl font-semibold text-white">품절</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            <p className="mb-4 text-gray-600">{product.description}</p>

            {productReviews.length > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({productReviews.length}개 리뷰)
                </span>
              </div>
            )}

            <div className="mb-6 text-3xl font-bold text-green-700">{product.price.toLocaleString()}원</div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-600">
                재고: <span className={isOutOfStock ? 'font-semibold text-red-600' : ''}>{product.stock}개</span>
              </p>
            </div>

            {!isOutOfStock && (
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">수량</label>
                <Select value={quantity.toString()} onValueChange={(val) => setQuantity(Number(val))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-4">
              <Button className="flex-1" size="lg" onClick={() => void handleAddToCart()} disabled={isOutOfStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isOutOfStock ? '품절' : '장바구니 담기'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => void handleToggleWishlist()}>
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold">상세 설명</h3>
                <p className="text-gray-700">{product.detailedDescription}</p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">식물 관리법</h3>
                <p className="text-gray-700">{product.careInstructions}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="mb-6 text-2xl font-bold">고객 리뷰 ({productReviews.length})</h2>

          {user && (
            <div ref={reviewFormRef} className="mb-6 rounded-lg bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="font-semibold">{editingReviewId ? '리뷰 수정' : '리뷰 작성'}</h3>
                {editingReviewId && <span className="text-sm text-gray-500">현재 리뷰를 수정하는 중입니다.</span>}
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">별점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} type="button">
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                placeholder="리뷰를 작성해 주세요."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="mb-4"
                rows={4}
              />

              <div className="flex gap-2">
                <Button onClick={() => void handleSubmitReview()} disabled={isSubmittingReview}>
                  {isSubmittingReview ? '처리 중...' : editingReviewId ? '수정하기' : '작성하기'}
                </Button>
                {editingReviewId && (
                  <Button variant="outline" onClick={resetReviewForm} disabled={isSubmittingReview}>
                    취소
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {productReviews.length === 0 ? (
              <p className="py-8 text-center text-gray-500">아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요.</p>
            ) : (
              productReviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>

                    {user?.id === review.userId && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditReview(review)}>
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => void handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                        >
                          {deletingReviewId === review.id ? '삭제 중...' : '삭제'}
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
