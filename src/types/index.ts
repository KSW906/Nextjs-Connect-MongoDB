// Product Types
export interface Product {
  id: string
  name: string
  description: string
  detailedDescription: string
  careInstructions: string
  price: number
  stock: number
  category: string
  image: string
  createdAt: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  isAdmin: boolean
  createdAt: string
}

// Cart Types
export interface CartItem {
  productId: string
  quantity: number
}

export interface CartActionResult {
  success: boolean
  message?: string
  requiresLogin?: boolean
}

export interface OrderActionResult {
  success: boolean
  message?: string
  requiresLogin?: boolean
  orderId?: string
}

export interface ReviewActionResult {
  success: boolean
  message?: string
  requiresLogin?: boolean
}

export interface WishlistActionResult {
  success: boolean
  message?: string
  requiresLogin?: boolean
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'
export type PaymentMethod = 'card' | 'transfer' | 'kakaopay'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
export type RefundStatus = 'none' | 'requested' | 'processing' | 'refunded' | 'rejected'

export interface ShippingInfo {
  recipientName: string
  zipcode?: string
  address: string
  addressDetail?: string
  phone: string
  message?: string
}

export interface OrderItem {
  productId: string
  productName: string
  productImage: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  shippingInfo: ShippingInfo
  createdAt: string
  estimatedDelivery: string
  paidAt?: string | null
  shippedAt?: string | null
  deliveredAt?: string | null
  cancelledAt?: string | null
  refundedAt?: string | null
  cancelReason?: string
  courier?: string
  trackingNumber?: string
  refundStatus: RefundStatus
  memo?: string
}

export interface CreateOrderInput {
  paymentMethod: PaymentMethod
  shippingInfo: ShippingInfo
}

export interface UpdateOrderInput {
  status: OrderStatus
  cancelReason?: string
  courier?: string
  trackingNumber?: string
  refundStatus?: RefundStatus
  memo?: string
}

// Review Types
export interface Review {
  id: string
  userId: string
  productId: string
  userName: string
  rating: number
  content: string
  createdAt: string
  updatedAt?: string
}

// Sort Types
export type SortOption = 'latest' | 'price-asc' | 'price-desc'
