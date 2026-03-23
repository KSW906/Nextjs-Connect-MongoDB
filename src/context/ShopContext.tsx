'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Product,
  CartItem,
  Order,
  Review,
  CartActionResult,
  ReviewActionResult,
  WishlistActionResult,
} from '../types'
import { mockProducts } from '../data/mockProducts'
import { useAuth } from './AuthContext'

interface ShopContextType {
  products: Product[]
  cart: CartItem[]
  isCartLoading: boolean
  wishlist: string[]
  isWishlistLoading: boolean
  orders: Order[]
  reviews: Review[]
  addToCart: (productId: string, quantity?: number) => Promise<CartActionResult>
  removeFromCart: (productId: string) => Promise<CartActionResult>
  updateCartQuantity: (productId: string, quantity: number) => Promise<CartActionResult>
  clearCart: () => Promise<CartActionResult>
  toggleWishlist: (productId: string) => Promise<WishlistActionResult>
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string
  cancelOrder: (orderId: string) => boolean
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'userName'>) => Promise<ReviewActionResult>
  updateReview: (id: string, content: string, rating: number) => Promise<ReviewActionResult>
  deleteReview: (id: string) => Promise<ReviewActionResult>
  getCartTotal: () => number
  getProductById: (id: string) => Product | undefined
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

function cartLoginRequired(): CartActionResult {
  return {
    success: false,
    message: '로그인이 필요합니다.',
    requiresLogin: true,
  }
}

function reviewLoginRequired(): ReviewActionResult {
  return {
    success: false,
    message: '로그인이 필요합니다.',
    requiresLogin: true,
  }
}

function wishlistLoginRequired(): WishlistActionResult {
  return {
    success: false,
    message: '로그인이 필요합니다.',
    requiresLogin: true,
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartLoading, setIsCartLoading] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    try {
      const parsedProducts = savedProducts ? JSON.parse(savedProducts) : null
      if (parsedProducts && Array.isArray(parsedProducts) && parsedProducts.length > 0) {
        setProducts(parsedProducts)
      } else {
        setProducts(mockProducts)
        localStorage.setItem('products', JSON.stringify(mockProducts))
      }
    } catch {
      setProducts(mockProducts)
    }

    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('products', JSON.stringify(products))
  }, [products, isInitialized])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders, isInitialized])

  useEffect(() => {
    if (!isInitialized) return

    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        const data = await response.json()
        if (response.ok && data.success) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : [])
        }
      } catch {
        setReviews([])
      }
    }

    void loadReviews()
  }, [isInitialized, user?.id])

  useEffect(() => {
    if (!isInitialized) return

    if (!user) {
      setCart([])
      setIsCartLoading(false)
      setWishlist([])
      setIsWishlistLoading(false)
      return
    }

    const loadCart = async () => {
      setIsCartLoading(true)
      try {
        const response = await fetch('/api/cart')
        const data = await response.json()

        if (response.ok && data.success) {
          setCart(Array.isArray(data.items) ? data.items : [])
        } else {
          setCart([])
        }
      } catch {
        setCart([])
      } finally {
        setIsCartLoading(false)
      }
    }

    const loadWishlist = async () => {
      setIsWishlistLoading(true)
      try {
        const response = await fetch('/api/wishlist')
        const data = await response.json()
        if (response.ok && data.success) {
          setWishlist(Array.isArray(data.productIds) ? data.productIds : [])
        } else {
          setWishlist([])
        }
      } catch {
        setWishlist([])
      } finally {
        setIsWishlistLoading(false)
      }
    }

    void loadCart()
    void loadWishlist()
  }, [isInitialized, user])

  const addToCart = async (productId: string, quantity: number = 1): Promise<CartActionResult> => {
    if (!user) return cartLoginRequired()

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '장바구니에 추가하지 못했습니다.' }
      }

      setCart(Array.isArray(data.items) ? data.items : [])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const removeFromCart = async (productId: string): Promise<CartActionResult> => {
    if (!user) return cartLoginRequired()

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '장바구니에서 삭제하지 못했습니다.' }
      }

      setCart(Array.isArray(data.items) ? data.items : [])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const updateCartQuantity = async (productId: string, quantity: number): Promise<CartActionResult> => {
    if (!user) return cartLoginRequired()

    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '수량을 변경하지 못했습니다.' }
      }

      setCart(Array.isArray(data.items) ? data.items : [])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const clearCart = async (): Promise<CartActionResult> => {
    if (!user) return cartLoginRequired()

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '장바구니를 비우지 못했습니다.' }
      }

      setCart(Array.isArray(data.items) ? data.items : [])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const toggleWishlist = async (productId: string): Promise<WishlistActionResult> => {
    if (!user) return wishlistLoginRequired()

    const isWishlisted = wishlist.includes(productId)

    try {
      const response = await fetch('/api/wishlist', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || (isWishlisted ? '찜 목록에서 제거하지 못했습니다.' : '찜 목록에 추가하지 못했습니다.'),
        }
      }

      setWishlist(Array.isArray(data.productIds) ? data.productIds : [])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder.id
  }

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find((o) => o.id === orderId)
    if (!order || order.status === 'shipping' || order.status === 'delivered') {
      return false
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled' as const } : o)))
    return true
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addReview = async (
    reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'userName'>
  ): Promise<ReviewActionResult> => {
    if (!user) return reviewLoginRequired()

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.review) {
        return { success: false, message: data.message || '리뷰를 등록하지 못했습니다.' }
      }

      setReviews((prev) => [data.review, ...prev])
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const updateReview = async (id: string, content: string, rating: number): Promise<ReviewActionResult> => {
    if (!user) return reviewLoginRequired()

    try {
      const response = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content, rating }),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.review) {
        return { success: false, message: data.message || '리뷰를 수정하지 못했습니다.' }
      }

      setReviews((prev) => prev.map((review) => (review.id === id ? data.review : review)))
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const deleteReview = async (id: string): Promise<ReviewActionResult> => {
    if (!user) return reviewLoginRequired()

    try {
      const response = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || '리뷰를 삭제하지 못했습니다.' }
      }

      setReviews((prev) => prev.filter((review) => review.id !== id))
      return { success: true }
    } catch {
      return { success: false, message: '서버 통신 중 오류가 발생했습니다.' }
    }
  }

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id)
  }

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        isCartLoading,
        wishlist,
        isWishlistLoading,
        orders,
        reviews,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        createOrder,
        cancelOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        updateReview,
        deleteReview,
        getCartTotal,
        getProductById,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export function useShop() {
  const context = useContext(ShopContext)
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider')
  }
  return context
}
