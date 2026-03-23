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

export interface ShippingInfo {
  recipientName: string
  address: string
  phone: string
  message?: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  shippingInfo: ShippingInfo
  createdAt: string
  estimatedDelivery: string
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
