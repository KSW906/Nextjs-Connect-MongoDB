'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useShop } from '@/context/ShopContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Package, ShoppingBag, Edit, Trash2, Plus } from 'lucide-react'
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

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useShop()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  // Product form state
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productDetailedDescription, setProductDetailedDescription] = useState('')
  const [productCareInstructions, setProductCareInstructions] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productStock, setProductStock] = useState('')
  const [productCategory, setProductCategory] = useState('대형식물')
  const [productImage, setProductImage] = useState('')

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push('/')
    }
  }, [user, router])

  if (!user || !user.isAdmin) return null

  const resetForm = () => {
    setProductName('')
    setProductDescription('')
    setProductDetailedDescription('')
    setProductCareInstructions('')
    setProductPrice('')
    setProductStock('')
    setProductCategory('대형식물')
    setProductImage('')
    setEditingProduct(null)
  }

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!productName || !productDescription || !productPrice || !productStock || !productImage) {
      toast.error('모든 필수 항목을 입력해주세요')
      return
    }

    const price = parseFloat(productPrice)
    const stock = parseInt(productStock)

    if (isNaN(price) || price <= 0) {
      toast.error('올바른 가격을 입력해주세요')
      return
    }

    if (isNaN(stock) || stock < 0) {
      toast.error('올바른 재고를 입력해주세요')
      return
    }

    if (editingProduct) {
      updateProduct(editingProduct, {
        name: productName,
        description: productDescription,
        detailedDescription: productDetailedDescription,
        careInstructions: productCareInstructions,
        price,
        stock,
        category: productCategory,
        image: productImage,
      })
      toast.success('상품이 수정되었습니다')
    } else {
      addProduct({
        name: productName,
        description: productDescription,
        detailedDescription: productDetailedDescription,
        careInstructions: productCareInstructions,
        price,
        stock,
        category: productCategory,
        image: productImage,
      })
      toast.success('상품이 등록되었습니다')
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product.id)
    setProductName(product.name)
    setProductDescription(product.description)
    setProductDetailedDescription(product.detailedDescription)
    setProductCareInstructions(product.careInstructions)
    setProductPrice(product.price.toString())
    setProductStock(product.stock.toString())
    setProductCategory(product.category)
    setProductImage(product.image)
    setIsAddDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId)
    toast.success('상품이 삭제되었습니다')
  }

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status)
    toast.success('주문 상태가 변경되었습니다')
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
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
                      <Label htmlFor="productName">상품명 *</Label>
                      <Input
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="productDescription">간단한 설명 *</Label>
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
                      <Label htmlFor="productCareInstructions">식물 관리법</Label>
                      <Textarea
                        id="productCareInstructions"
                        value={productCareInstructions}
                        onChange={(e) => setProductCareInstructions(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productPrice">가격 (원) *</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          required
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productStock">재고 *</Label>
                        <Input
                          id="productStock"
                          type="number"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                          required
                          min="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productCategory">카테고리</Label>
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger id="productCategory">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="대형식물">대형식물</SelectItem>
                          <SelectItem value="중형식물">중형식물</SelectItem>
                          <SelectItem value="공기정화식물">공기정화식물</SelectItem>
                          <SelectItem value="다육식물">다육식물</SelectItem>
                          <SelectItem value="화분">화분</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productImage">이미지 URL *</Label>
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
                    <p className="text-gray-600">주문이 없습니다</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => {
                  const orderItems = order.items
                    .map((item) => ({
                      ...item,
                      product: products.find((p) => p.id === item.productId)!,
                    }))
                    .filter((item) => item.product)

                  return (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2 text-lg">주문번호: {order.id}</CardTitle>
                            <p className="mb-1 text-sm text-gray-600">
                              주문일: {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                            </p>
                            <p className="mb-1 text-sm text-gray-600">배송지: {order.shippingInfo.address}</p>
                            <p className="text-sm text-gray-600">
                              받는사람: {order.shippingInfo.recipientName} ({order.shippingInfo.phone})
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(order.status)}
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">결제대기</SelectItem>
                                <SelectItem value="paid">결제완료</SelectItem>
                                <SelectItem value="shipping">배송중</SelectItem>
                                <SelectItem value="delivered">배송완료</SelectItem>
                                <SelectItem value="cancelled">취소됨</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {orderItems.map((item) => (
                            <div key={item.productId} className="flex gap-4">
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <ImageWithFallback
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.product.price.toLocaleString()}원 × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-3">
                            <p className="font-semibold">총 결제금액: {order.total.toLocaleString()}원</p>
                          </div>
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
