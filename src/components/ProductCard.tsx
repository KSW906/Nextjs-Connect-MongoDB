'use client'

import { Product } from '../types'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'sonner'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart, wishlist, toggleWishlist, reviews } = useShop()

  const isWishlisted = wishlist.includes(product.id)
  const isOutOfStock = product.stock === 0
  const productReviews = reviews.filter((review) => review.productId === product.id)
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return

    if (!user) {
      toast.error('로그인한 사용자만 장바구니를 이용할 수 있습니다.')
      router.push('/login')
      return
    }

    const result = await addToCart(product.id)
    if (result.success) {
      toast.success('장바구니에 추가되었습니다.')
    } else {
      toast.error(result.message)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()

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

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <ImageWithFallback src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-lg font-semibold text-white">품절</span>
          </div>
        )}
        <button
          onClick={(e) => void handleToggleWishlist(e)}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 transition-colors hover:bg-white"
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <CardContent className="p-4">
        <div className="mb-1 flex items-center justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate font-semibold">{product.name}</h3>
          <div className="flex flex-shrink-0 items-center gap-1 text-sm">
            <Star className={`h-4 w-4 text-amber-500 ${productReviews.length > 0 ? 'fill-current' : ''}`} />
            <span className="font-medium text-gray-700">
              {productReviews.length > 0 ? averageRating.toFixed(1) : '-'}
            </span>
            <span className="text-gray-500">({productReviews.length})</span>
          </div>
        </div>
        <p className="mb-2 line-clamp-1 text-sm text-gray-600">{product.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-green-700">{product.price.toLocaleString()}원</p>
          <p className="text-sm text-gray-500">재고: {product.stock}개</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={isOutOfStock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? '품절' : '장바구니'}
        </Button>
      </CardFooter>
    </Card>
  )
}
