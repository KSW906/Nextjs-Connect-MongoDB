'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { PaymentMethod } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, products, getCartTotal, createOrder } = useShop()

  const [recipientName, setRecipientName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [zipcode, setZipcode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [message, setMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) return null

  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((item): item is typeof item & { product: NonNullable<typeof item.product> } => item.product !== undefined)

  if (cartItems.length === 0) {
    if (typeof window !== 'undefined') {
      router.push('/cart')
    }
    return null
  }

  const total = getCartTotal()
  const shippingFee = total >= 50000 ? 0 : 3000
  const finalTotal = total + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipientName || !phone || !address) {
      toast.error('배송 정보를 모두 입력해주세요.')
      return
    }

    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        toast.error(`${item.product.name} 재고가 부족합니다.`)
        return
      }
    }

    const result = await createOrder({
      paymentMethod,
      shippingInfo: {
        recipientName,
        zipcode,
        address,
        addressDetail,
        phone,
        message,
      },
    })

    if (!result.success || !result.orderId) {
      toast.error(result.message || '주문을 생성하지 못했습니다.')
      return
    }

    toast.success('주문이 완료되었습니다.')
    router.push(`/order-complete/${result.orderId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-3xl font-bold">주문/결제</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>배송 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientName">받는 분</Label>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="010-0000-0000"
                />
              </div>
              <div>
                <Label htmlFor="zipcode">우편번호</Label>
                <Input id="zipcode" value={zipcode} onChange={(e) => setZipcode(e.target.value)} placeholder="12345" />
              </div>
              <div>
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="배송받을 주소를 입력해주세요"
                />
              </div>
              <div>
                <Label htmlFor="addressDetail">상세주소</Label>
                <Input
                  id="addressDetail"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="동, 호수 등을 입력해주세요"
                />
              </div>
              <div>
                <Label htmlFor="message">배송 요청사항</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="배송 시 요청사항을 입력해주세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.product.price.toLocaleString()}원 x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{(item.product.price * item.quantity).toLocaleString()}원</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">
                    신용/체크카드
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer" className="cursor-pointer">
                    계좌이체
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kakaopay" id="kakaopay" />
                  <Label htmlFor="kakaopay" className="cursor-pointer">
                    카카오페이
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>결제 금액</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">상품 금액</span>
                <span>{total.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>최종 결제 금액</span>
                <span className="text-green-700">{finalTotal.toLocaleString()}원</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/cart')} className="flex-1">
              취소
            </Button>
            <Button type="submit" className="flex-1" size="lg">
              {finalTotal.toLocaleString()}원 결제하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
