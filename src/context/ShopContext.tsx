'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  Product,
  CartItem,
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  Review,
  CartActionResult,
  OrderActionResult,
  ProductActionResult,
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
  createOrder: (order: CreateOrderInput) => Promise<OrderActionResult>
  cancelOrder: (orderId: string) => Promise<OrderActionResult>
  updateOrderStatus: (orderId: string, updates: UpdateOrderInput) => Promise<OrderActionResult>
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<ProductActionResult>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<ProductActionResult>
  deleteProduct: (id: string) => Promise<ProductActionResult>
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

function orderLoginRequired(): OrderActionResult {
  return {
    success: false,
    message: '濡쒓렇?몄씠 ?꾩슂?⑸땲??',
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
  const syncedCustomProductIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const savedProducts = localStorage.getItem('products')
    try {
      const parsedProducts = savedProducts ? JSON.parse(savedProducts) : null
      if (parsedProducts && Array.isArray(parsedProducts) && parsedProducts.length > 0) {
        const savedProductsById = new Map(parsedProducts.map((product: Product) => [product.id, product]))
        const mergedProducts = [
          ...mockProducts.map((product) => {
            const savedProduct = savedProductsById.get(product.id)
            return savedProduct ? { ...savedProduct, ...product } : product
          }),
          ...parsedProducts.filter((product: Product) => !mockProducts.some((mockProduct) => mockProduct.id === product.id)),
        ]
        setProducts(mergedProducts)
        localStorage.setItem('products', JSON.stringify(mergedProducts))
      } else {
        setProducts(mockProducts)
        localStorage.setItem('products', JSON.stringify(mockProducts))
      }
    } catch {
      setProducts(mockProducts)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('products', JSON.stringify(products))
  }, [products, isInitialized])

  useEffect(() => {
    if (!isInitialized || !user?.isAdmin) return

    const customProducts = products.filter((product) => !mockProducts.some((mockProduct) => mockProduct.id === product.id))
    const unsyncedProducts = customProducts.filter((product) => !syncedCustomProductIdsRef.current.has(product.id))

    if (unsyncedProducts.length === 0) return

    const syncCustomProducts = async () => {
      for (const product of unsyncedProducts) {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          })
          const data = await response.json()

          if (response.ok && data.success) {
            syncedCustomProductIdsRef.current.add(product.id)
          }
        } catch {
          return
        }
      }
    }

    void syncCustomProducts()
  }, [isInitialized, products, user?.isAdmin])

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
      setOrders([])
      return
    }

    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()

        if (response.ok && data.success) {
          setOrders(Array.isArray(data.orders) ? data.orders : [])
        } else {
          setOrders([])
        }
      } catch {
        setOrders([])
      }
    }

    void loadOrders()
  }, [isInitialized, user])

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

  const createOrder = async (orderData: CreateOrderInput): Promise<OrderActionResult> => {
    if (!user) return orderLoginRequired()

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.order) {
        return { success: false, message: data.message || '二쇰Ц?섏? 紐삵뻽?듬땲??' }
      }

      setOrders((prev) => [data.order, ...prev])
      setCart(Array.isArray(data.cartItems) ? data.cartItems : [])

      if (Array.isArray(data.updatedProducts)) {
        setProducts((prev) =>
          prev.map((product) => {
            const updatedProduct = data.updatedProducts.find((item: Product) => item.id === product.id)
            return updatedProduct ?? product
          })
        )
      }

      return { success: true, orderId: data.order.id }
    } catch {
      return { success: false, message: '?쒕쾭 ?듭떊 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.' }
    }
  }

  const cancelOrder = async (orderId: string): Promise<OrderActionResult> => {
    if (!user) return orderLoginRequired()

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'cancelled' }),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.order) {
        return { success: false, message: data.message || '二쇰Ц??痍⑥냼?섏? 紐삵뻽?듬땲??' }
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? data.order : order)))
      return { success: true, orderId }
    } catch {
      return { success: false, message: '?쒕쾭 ?듭떊 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.' }
    }
  }

  const updateOrderStatus = async (orderId: string, updates: UpdateOrderInput): Promise<OrderActionResult> => {
    if (!user) return orderLoginRequired()

    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, ...updates }),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.order) {
        return { success: false, message: data.message || '二쇰Ц ?곹깭瑜?蹂寃쏀븯吏 紐삵뻽?듬땲??' }
      }

      setOrders((prev) => prev.map((order) => (order.id === orderId ? data.order : order)))
      return { success: true, orderId }
    } catch {
      return { success: false, message: '?쒕쾭 ?듭떊 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.' }
    }
  }

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<ProductActionResult> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.product) {
        return { success: false, message: data.message || 'Failed to create product.' }
      }

      setProducts((prev) => [data.product, ...prev])
      return { success: true }
    } catch {
      return { success: false, message: 'Server communication failed.' }
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>): Promise<ProductActionResult> => {
    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const data = await response.json()

      if (!response.ok || !data.success || !data.product) {
        return { success: false, message: data.message || 'Failed to update product.' }
      }

      setProducts((prev) => prev.map((product) => (product.id === id ? data.product : product)))
      return { success: true }
    } catch {
      return { success: false, message: 'Server communication failed.' }
    }
  }

  const deleteProduct = async (id: string): Promise<ProductActionResult> => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to delete product.' }
      }

      setProducts((prev) => prev.filter((product) => product.id !== id))
      return { success: true }
    } catch {
      return { success: false, message: 'Server communication failed.' }
    }
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
