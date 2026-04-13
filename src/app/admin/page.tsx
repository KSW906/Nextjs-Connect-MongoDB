'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Edit, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import type { Order, PaymentMethod, Product, RefundStatus, UpdateOrderInput } from '@/types'

type OrderDraft = {
  courier: string
  trackingNumber: string
  refundStatus: RefundStatus
  memo: string
}

const PRODUCT_CATEGORIES = ['관엽식물', '중형식물', '공기정화식물', '다육식물', '화분'] as const

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useShop()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productDetailedDescription, setProductDetailedDescription] = useState('')
  const [productCareInstructions, setProductCareInstructions] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productStock, setProductStock] = useState('')
  const [productCategory, setProductCategory] = useState<(typeof PRODUCT_CATEGORIES)[number]>('관엽식물')
  const [productImage, setProductImage] = useState('')
  const [orderDrafts, setOrderDrafts] = useState<Record<string, OrderDraft>>({})

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    setOrderDrafts((prev) => {
      const next: Record<string, OrderDraft> = {}

      orders.forEach((order) => {
        next[order.id] = prev[order.id] || {
          courier: order.courier || '',
          trackingNumber: order.trackingNumber || '',
          refundStatus: order.refundStatus,
          memo: order.memo || '',
        }
      })
      return next
    })
  }, [orders])

  if (!user || !user.isAdmin) return null

  const resetForm = () => {
    setProductName('')
    setProductDescription('')
    setProductDetailedDescription('')
    setProductCareInstructions('')
    setProductPrice('')
    setProductStock('')
    setProductCategory('관엽식물')
    setProductImage('')
    setEditingProduct(null)
  }

  const getPaymentMethodLabel = (paymentMethod: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      card: '신용/체크카드',
      transfer: '계좌이체',
      kakaopay: '카카오페이',
    }

    return labels[paymentMethod]
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productName || !productDescription || !productPrice || !productStock || !productImage) {
      toast.error('모든 필수 항목을 입력해주세요.')
      return
    }

    const price = Number(productPrice)
    const stock = Number(productStock)

    if (Number.isNaN(price) || price <= 0) {
      toast.error('올바른 가격을 입력해주세요.')
      return
    }

    if (Number.isNaN(stock) || stock < 0) {
      toast.error('올바른 재고를 입력해주세요.')
      return
    }

    if (editingProduct) {
      const result = await updateProduct(editingProduct, {
        name: productName,
        description: productDescription,
        detailedDescription: productDetailedDescription,
        careInstructions: productCareInstructions,
        price,
        stock,
        category: productCategory,
        image: productImage,
      })
      if (!result.success) {
        toast.error(result.message || 'Product update failed.')
        return
      }
      toast.success('상품을 수정했습니다.')
    } else {
      const result = await addProduct({
        name: productName,
        description: productDescription,
        detailedDescription: productDetailedDescription,
        careInstructions: productCareInstructions,
        price,
        stock,
        category: productCategory,
        image: productImage,
      })
      if (!result.success) {
        toast.error(result.message || 'Product creation failed.')
        return
      }
      toast.success('상품을 등록했습니다.')
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id)
    setProductName(product.name)
    setProductDescription(product.description)
    setProductDetailedDescription(product.detailedDescription)
    setProductCareInstructions(product.careInstructions)
    setProductPrice(product.price.toString())
    setProductStock(product.stock.toString())
    setProductCategory((PRODUCT_CATEGORIES.includes(product.category as (typeof PRODUCT_CATEGORIES)[number]) ? product.category : '관엽식물') as (typeof PRODUCT_CATEGORIES)[number])
    setProductImage(product.image)
    setIsAddDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    const result = await deleteProduct(productId)
    if (!result.success) {
      toast.error(result.message || 'Product deletion failed.')
      return
    }
    toast.success('상품을 삭제했습니다.')
  }

  const getOrderDraft = (order: Order): OrderDraft =>
    orderDrafts[order.id] || {
      courier: order.courier || '',
      trackingNumber: order.trackingNumber || '',
      refundStatus: order.refundStatus,
      memo: order.memo || '',
    }

  const updateOrderDraft = (orderId: string, updates: Partial<OrderDraft>) => {
    setOrderDrafts((prev) => ({
      ...prev,
      [orderId]: {
        courier: prev[orderId]?.courier || '',
        trackingNumber: prev[orderId]?.trackingNumber || '',
        refundStatus: prev[orderId]?.refundStatus || 'none',
        memo: prev[orderId]?.memo || '',
        ...updates,
      },
    }))
  }

  const saveOrder = async (orderId: string, payload: UpdateOrderInput, successMessage: string) => {
    const result = await updateOrderStatus(orderId, payload)
    if (result.success) {
      toast.success(successMessage)
      return
    }

    toast.error(result.message || '주문 정보를 저장하지 못했습니다.')
  }

  const handleUpdateOrderStatus = async (order: Order, status: Order['status']) => {
    const draft = getOrderDraft(order)

    await saveOrder(
      order.id,
      {
        status,
        courier: draft.courier,
        trackingNumber: draft.trackingNumber,
        refundStatus: draft.refundStatus,
        memo: draft.memo,
      },
      '주문 상태를 변경했습니다.'
    )
  }

  const handleSaveOrderDetails = async (order: Order) => {
    const draft = getOrderDraft(order)

    await saveOrder(
      order.id,
      {
        status: order.status,
        courier: draft.courier,
        trackingNumber: draft.trackingNumber,
        refundStatus: draft.refundStatus,
        memo: draft.memo,
      },
      '주문 처리 정보를 저장했습니다.'
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      pending: { label: '결제 대기', variant: 'secondary' },
      paid: { label: '결제 완료', variant: 'default' },
      shipping: { label: '배송 중', variant: 'default' },
      delivered: { label: '배송 완료', variant: 'default' },
      cancelled: { label: '취소됨', variant: 'destructive' },
    }

    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getRefundBadge = (status: RefundStatus) => {
    const variants: Record<RefundStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
      none: { label: '환불 없음', variant: 'secondary' },
      requested: { label: '환불 요청', variant: 'secondary' },
      processing: { label: '환불 처리중', variant: 'default' },
      refunded: { label: '환불 완료', variant: 'default' },
      rejected: { label: '환불 거절', variant: 'destructive' },
    }

    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-3xl font-bold">관리자 페이지</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              주문 관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="mb-6">
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    상품 등록
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? '상품 수정' : '상품 등록'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="productName">상품명</Label>
                      <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="productDescription">간단 설명</Label>
                      <Input
                        id="productDescription"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productDetailedDescription">상세 설명</Label>
                      <Textarea
                        id="productDetailedDescription"
                        value={productDetailedDescription}
                        onChange={(e) => setProductDetailedDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCareInstructions">관리 방법</Label>
                      <Textarea
                        id="productCareInstructions"
                        value={productCareInstructions}
                        onChange={(e) => setProductCareInstructions(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productPrice">가격</Label>
                        <Input id="productPrice" type="number" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required min="0" />
                      </div>
                      <div>
                        <Label htmlFor="productStock">재고</Label>
                        <Input id="productStock" type="number" value={productStock} onChange={(e) => setProductStock(e.target.value)} required min="0" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productCategory">카테고리</Label>
                      <Select value={productCategory} onValueChange={(value) => setProductCategory(value as (typeof PRODUCT_CATEGORIES)[number])}>
                        <SelectTrigger id="productCategory">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productImage">이미지 URL</Label>
                      <Input
                        id="productImage"
                        value={productImage}
                        onChange={(e) => setProductImage(e.target.value)}
                        required
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">{editingProduct ? '수정' : '등록'}</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm()
                          setIsAddDialogOpen(false)
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <ImageWithFallback src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold">{product.name}</h3>
                    <p className="mb-2 line-clamp-1 text-sm text-gray-600">{product.description}</p>
                    <div className="mb-4 flex justify-between">
                      <p className="text-lg font-semibold text-green-700">{product.price.toLocaleString()}원</p>
                      <p className="text-sm text-gray-500">재고: {product.stock}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditProduct(product)}>
                        <Edit className="mr-1 h-4 w-4" />
                        수정
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="mr-1 h-4 w-4" />
                            삭제
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
                            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>삭제</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-600">주문이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => {
                  const draft = getOrderDraft(order)
                  const fullAddress = [order.shippingInfo.address, order.shippingInfo.addressDetail].filter(Boolean).join(' ')

                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <CardTitle className="mb-2 text-lg">주문번호: {order.orderNumber}</CardTitle>
                            <p className="mb-1 text-sm text-gray-600">주문일: {new Date(order.createdAt).toLocaleDateString('ko-KR')}</p>
                            <p className="mb-1 text-sm text-gray-600">수령인: {order.shippingInfo.recipientName} ({order.shippingInfo.phone})</p>
                            <p className="mb-1 text-sm text-gray-600">우편번호: {order.shippingInfo.zipcode || '-'}</p>
                            <p className="text-sm text-gray-600">배송지: {fullAddress || '-'}</p>
                          </div>
                          <div className="flex flex-col items-start gap-2 lg:items-end">
                            <div className="flex gap-2">
                              {getStatusBadge(order.status)}
                              {getRefundBadge(order.refundStatus)}
                            </div>
                            <Select value={order.status} onValueChange={(value) => void handleUpdateOrderStatus(order, value as Order['status'])}>
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">결제 대기</SelectItem>
                                <SelectItem value="paid">결제 완료</SelectItem>
                                <SelectItem value="shipping">배송 중</SelectItem>
                                <SelectItem value="delivered">배송 완료</SelectItem>
                                <SelectItem value="cancelled">취소됨</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.productId} className="flex gap-4">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <ImageWithFallback src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-sm text-gray-600">{item.unitPrice.toLocaleString()}원 x {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-gray-700">{item.lineTotal.toLocaleString()}원</p>
                            </div>
                          ))}
                        </div>

                        <div className="grid gap-2 rounded-lg border p-4 text-sm text-gray-600 md:grid-cols-2">
                          <p>결제수단: {getPaymentMethodLabel(order.paymentMethod)}</p>
                          <p>결제상태: {order.paymentStatus}</p>
                          <p>배송 예정일: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('ko-KR') : '-'}</p>
                          <p>배송 시작일: {order.shippedAt ? new Date(order.shippedAt).toLocaleDateString('ko-KR') : '-'}</p>
                          <p>배송 완료일: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('ko-KR') : '-'}</p>
                          <p>환불 완료일: {order.refundedAt ? new Date(order.refundedAt).toLocaleDateString('ko-KR') : '-'}</p>
                        </div>

                        {(order.shippingInfo.message || order.cancelReason) && (
                          <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">배송 요청사항</p>
                              <p className="text-sm text-gray-600">{order.shippingInfo.message || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">취소/환불 사유</p>
                              <p className="text-sm text-gray-600">{order.cancelReason || '-'}</p>
                            </div>
                          </div>
                        )}

                        <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`courier-${order.id}`}>택배사</Label>
                            <Input
                              id={`courier-${order.id}`}
                              value={draft.courier}
                              onChange={(e) => updateOrderDraft(order.id, { courier: e.target.value })}
                              placeholder="CJ대한통운"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tracking-${order.id}`}>송장번호</Label>
                            <Input
                              id={`tracking-${order.id}`}
                              value={draft.trackingNumber}
                              onChange={(e) => updateOrderDraft(order.id, { trackingNumber: e.target.value })}
                              placeholder="1234-5678-9012"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>환불 상태</Label>
                            <Select
                              value={draft.refundStatus}
                              onValueChange={(value) => updateOrderDraft(order.id, { refundStatus: value as RefundStatus })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">환불 없음</SelectItem>
                                <SelectItem value="requested">환불 요청</SelectItem>
                                <SelectItem value="processing">환불 처리중</SelectItem>
                                <SelectItem value="refunded">환불 완료</SelectItem>
                                <SelectItem value="rejected">환불 거절</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`memo-${order.id}`}>관리 메모</Label>
                            <Textarea
                              id={`memo-${order.id}`}
                              value={draft.memo}
                              onChange={(e) => updateOrderDraft(order.id, { memo: e.target.value })}
                              rows={3}
                              placeholder="배송 지연 사유나 고객 대응 메모를 남겨주세요"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold">총 결제금액: {order.total.toLocaleString()}원</p>
                            <p className="text-sm text-gray-600">배송비: {order.shippingFee.toLocaleString()}원</p>
                          </div>
                          <Button onClick={() => void handleSaveOrderDetails(order)}>주문 처리 정보 저장</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
