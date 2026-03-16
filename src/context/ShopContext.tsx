'use client';

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem, Order, Review } from '../types'
import { mockProducts } from '../data/mockProducts'

interface ShopContextType {
  products: Product[]
  cart: CartItem[]
  wishlist: string[]
  orders: Order[]
  reviews: Review[]
  addToCart: (productId: string, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => string
  cancelOrder: (orderId: string) => boolean
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  updateReview: (id: string, content: string, rating: number) => void
  deleteReview: (id: string) => void
  getCartTotal: () => number
  getProductById: (id: string) => Product | undefined
}

const ShopContext = createContext<ShopContextType | undefined>(undefined)

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data from localStorage
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
    } catch (e) {
      setProducts(mockProducts)
    }

    const savedCart = localStorage.getItem('cart')
    if (savedCart) setCart(JSON.parse(savedCart))

    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) setOrders(JSON.parse(savedOrders))

    const savedReviews = localStorage.getItem('reviews')
    if (savedReviews) setReviews(JSON.parse(savedReviews))

    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isInitialized) localStorage.setItem('products', JSON.stringify(products))
  }, [products, isInitialized])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart, isInitialized])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist, isInitialized])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders, isInitialized])

  useEffect(() => {
    if (isInitialized) localStorage.setItem('reviews', JSON.stringify(reviews))
  }, [reviews, isInitialized])

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { productId, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
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

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setReviews((prev) => [newReview, ...prev])
  }

  const updateReview = (id: string, content: string, rating: number) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, content, rating } : r)))
  }

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
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
        wishlist,
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
