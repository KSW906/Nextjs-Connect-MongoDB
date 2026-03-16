'use client'

import { useRouter } from 'next/navigation'
import { useShop } from '@/context/ShopContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, products, removeFromCart, updateCartQuantity, getCartTotal } = useShop()

  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)!,
    }))
    .filter((item) => item.product)

  const total = getCartTotal()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.stock) {
      toast.error('재고가 부족합니다')
      return
    }
    updateCartQuantity(productId, newQuantity)
  }

  const handleRemove = (productId: string) => {
    removeFromCart(productId)
    toast.success('장바구니에서 제거되었습니다')
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('로그인이 필요합니다')
      router.push('/login')
      return
    }

    if (cartItems.length === 0) {
      toast.error('장바구니가 비어있습니다')
      return
    }

    // Check stock
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        toast.error(`${item.product.name}의 재고가 부족합니다`)
        return
      }
      if (item.product.stock === 0) {
        toast.error(`${item.product.name}이(가) 품절되었습니다`)
        return
      }
    }

    router.push('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-6xl">🛒</div>
          <h2 className="mb-2 text-2xl font-semibold">장바구니가 비어있습니다</h2>
          <p className="mb-6 text-gray-600">마음에 드는 식물을 담아보세요</p>
          <Button onClick={() => router.push('/')}>쇼핑 계속하기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-3xl font-bold">장바구니</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className="mb-1 cursor-pointer font-semibold hover:text-green-700"
                        onClick={() => router.push(`/product/${item.productId}`)}
                      >
                        {item.product.name}
                      </h3>
                      <p className="mb-2 text-sm text-gray-600">{item.product.price.toLocaleString()}원</p>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[3rem] px-4 py-2 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => handleRemove(item.productId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {item.quantity > item.product.stock && (
                        <p className="mt-2 text-sm text-red-600">재고 부족 (남은 재고: {item.product.stock}개)</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{(item.product.price * item.quantity).toLocaleString()}원</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span>{total.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span>{total >= 50000 ? '무료' : '3,000원'}</span>
                  </div>
                </div>

                <div className="mb-6 border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>총 결제 금액</span>
                    <span className="text-green-700">{(total + (total >= 50000 ? 0 : 3000)).toLocaleString()}원</span>
                  </div>
                </div>

                {total < 50000 && (
                  <p className="mb-4 text-center text-sm text-gray-600">
                    {(50000 - total).toLocaleString()}원 더 담으면 무료배송!
                  </p>
                )}

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  주문하기
                </Button>

                <Button variant="outline" onClick={() => router.push('/')} className="mt-2 w-full">
                  쇼핑 계속하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
