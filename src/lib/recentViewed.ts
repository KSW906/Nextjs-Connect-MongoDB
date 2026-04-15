import type { Product } from '@/types'

export const RECENT_VIEWED_STORAGE_KEY = 'recent-viewed-products'
export const RECENT_VIEWED_UPDATED_EVENT = 'recent-viewed-updated'
const RECENT_VIEWED_LIMIT = 6

export type RecentViewedProduct = Pick<Product, 'id' | 'name' | 'image' | 'price'> & {
  viewedAt: string
}

export function getRecentViewedProducts(): RecentViewedProduct[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(RECENT_VIEWED_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as RecentViewedProduct[]) : []

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.image === 'string' &&
        typeof item.price === 'number' &&
        typeof item.viewedAt === 'string'
    )
  } catch {
    return []
  }
}

export function saveRecentViewedProduct(product: Product) {
  if (typeof window === 'undefined') {
    return
  }

  const nextItem: RecentViewedProduct = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    viewedAt: new Date().toISOString(),
  }

  const nextItems = [nextItem, ...getRecentViewedProducts().filter((item) => item.id !== product.id)].slice(
    0,
    RECENT_VIEWED_LIMIT
  )

  window.localStorage.setItem(RECENT_VIEWED_STORAGE_KEY, JSON.stringify(nextItems))
  window.dispatchEvent(new Event(RECENT_VIEWED_UPDATED_EVENT))
}

export function clearRecentViewedProducts() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(RECENT_VIEWED_STORAGE_KEY)
  window.dispatchEvent(new Event(RECENT_VIEWED_UPDATED_EVENT))
}
