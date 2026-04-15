'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Clock3, Eye, Heart, SlidersHorizontal, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { useAuth } from '@/context/AuthContext'
import { useShop } from '@/context/ShopContext'
import {
  RECENT_VIEWED_UPDATED_EVENT,
  clearRecentViewedProducts,
  getRecentViewedProducts,
  type RecentViewedProduct,
} from '@/lib/recentViewed'

type SortMode = 'recent' | 'price-desc' | 'price-asc'

function isToday(dateString: string) {
  const viewedDate = new Date(dateString)
  const today = new Date()

  return (
    viewedDate.getFullYear() === today.getFullYear() &&
    viewedDate.getMonth() === today.getMonth() &&
    viewedDate.getDate() === today.getDate()
  )
}

function sortItems(items: RecentViewedProduct[], sortMode: SortMode) {
  const sorted = [...items]

  switch (sortMode) {
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    default:
      sorted.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
      break
  }

  return sorted
}

function RecentViewedPanel({
  items,
  showTodayOnly,
  sortMode,
  wishlist,
  onToggleToday,
  onSortChange,
  onSelect,
  onToggleWishlist,
  onClear,
}: {
  items: RecentViewedProduct[]
  showTodayOnly: boolean
  sortMode: SortMode
  wishlist: string[]
  onToggleToday: () => void
  onSortChange: (mode: SortMode) => void
  onSelect: (id: string) => void
  onToggleWishlist: (id: string) => void
  onClear: () => void
}) {
  return (
    <>
      <div className="border-b border-gray-100 px-2.5 py-2.5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
          <SlidersHorizontal className="h-3 w-3" />
          Filter & Sort
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggleToday}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              showTodayOnly ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            오늘 본 상품만
          </button>
          <button
            type="button"
            onClick={() => onSortChange('recent')}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              sortMode === 'recent' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            최신순
          </button>
          <button
            type="button"
            onClick={() => onSortChange('price-desc')}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              sortMode === 'price-desc'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            가격 높은순
          </button>
          <button
            type="button"
            onClick={() => onSortChange('price-asc')}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              sortMode === 'price-asc'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            가격 낮은순
          </button>
        </div>
      </div>

      <div className="space-y-2.5 p-2.5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-gray-700">최근 본 상품이 아직 없어요.</p>
            <p className="mt-1 text-xs text-gray-500">상품 상세 페이지를 열어보면 여기에 쌓입니다.</p>
          </div>
        ) : (
          items.map((item, index) => {
            const isWishlisted = wishlist.includes(item.id)

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-xl border transition ${
                  index === 0
                    ? 'border-emerald-200 bg-emerald-50/70'
                    : 'border-transparent bg-white hover:border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <button type="button" onClick={() => onSelect(item.id)} className="block w-full text-left">
                  <div className="relative overflow-hidden border-b border-gray-100">
                    <div className={`${index === 0 ? 'aspect-[1.08/1]' : 'aspect-square'} bg-gray-100`}>
                      <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        Most Recent
                      </div>
                    )}
                  </div>
                </button>

                <div className="p-2.5">
                  <button type="button" onClick={() => onSelect(item.id)} className="block w-full text-left">
                    <p className="line-clamp-2 text-xs font-medium text-gray-900">{item.name}</p>
                    <p className="mt-2 text-sm font-semibold text-emerald-700">{item.price.toLocaleString()}원</p>
                  </button>

                  <div className="mt-2.5 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">{new Date(item.viewedAt).toLocaleDateString('ko-KR')}</p>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(item.id)}
                      className="rounded-full border border-gray-200 p-1.5 text-gray-500 transition hover:border-emerald-200 hover:bg-white"
                      aria-label="찜하기"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-gray-100 p-2.5">
        <Button type="button" variant="outline" className="w-full border-gray-200 text-gray-600" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          전체 비우기
        </Button>
      </div>
    </>
  )
}

export function RecentViewedFloating() {
  const router = useRouter()
  const { user } = useAuth()
  const { wishlist, toggleWishlist } = useShop()
  const [items, setItems] = useState<RecentViewedProduct[]>([])
  const [isDesktopOpen, setIsDesktopOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showTodayOnly, setShowTodayOnly] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('recent')

  useEffect(() => {
    const syncItems = () => {
      setItems(getRecentViewedProducts())
    }

    syncItems()
    window.addEventListener('storage', syncItems)
    window.addEventListener(RECENT_VIEWED_UPDATED_EVENT, syncItems)

    return () => {
      window.removeEventListener('storage', syncItems)
      window.removeEventListener(RECENT_VIEWED_UPDATED_EVENT, syncItems)
    }
  }, [])

  const filteredItems = useMemo(() => {
    const baseItems = showTodayOnly ? items.filter((item) => isToday(item.viewedAt)) : items
    return sortItems(baseItems, sortMode)
  }, [items, showTodayOnly, sortMode])

  const handleSelect = (id: string) => {
    setIsMobileOpen(false)
    router.push(`/product/${id}`)
  }

  const handleClear = () => {
    clearRecentViewedProducts()
    setItems([])
    setIsMobileOpen(false)
  }

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('로그인 후 찜 목록을 사용할 수 있어요.')
      router.push('/login')
      return
    }

    const result = await toggleWishlist(productId)
    if (!result.success) {
      toast.error(result.message || '찜 목록을 업데이트하지 못했습니다.')
      return
    }

    const isNowWishlisted = !wishlist.includes(productId)
    toast.success(isNowWishlisted ? '찜 목록에 추가했습니다.' : '찜 목록에서 제거했습니다.')
  }

  return (
    <>
      <div className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="pointer-events-auto flex items-center gap-2">
          {!isDesktopOpen && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-16 rounded-full border-emerald-200 bg-white/95 px-2 shadow-xl backdrop-blur"
              onClick={() => setIsDesktopOpen(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {isDesktopOpen && (
            <aside className="bg-white/92 w-44 overflow-hidden rounded-2xl border border-emerald-100 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-3 py-2.5">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                    <Clock3 className="h-3.5 w-3.5" />
                    최근 본 상품
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {items.length === 0 ? '아직 기록이 없어요' : `${filteredItems.length}개 표시 중`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDesktopOpen(false)}
                  className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="최근 본 상품 접기"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[66vh] overflow-y-auto">
                <RecentViewedPanel
                  items={filteredItems}
                  showTodayOnly={showTodayOnly}
                  sortMode={sortMode}
                  wishlist={wishlist}
                  onToggleToday={() => setShowTodayOnly((prev) => !prev)}
                  onSortChange={setSortMode}
                  onSelect={handleSelect}
                  onToggleWishlist={(id) => void handleToggleWishlist(id)}
                  onClear={handleClear}
                />
              </div>
            </aside>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-40 lg:hidden">
        <Button
          type="button"
          className="h-14 rounded-full bg-emerald-600 px-4 shadow-xl hover:bg-emerald-700"
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          <Eye className="mr-2 h-4 w-4" />
          최근 본 상품
        </Button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="최근 본 상품 닫기"
            className="absolute inset-0 bg-black/35"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-hidden rounded-t-[28px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                  <Clock3 className="h-4 w-4" />
                  최근 본 상품
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {items.length === 0 ? '아직 기록이 없어요' : `${filteredItems.length}개 표시 중`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(82vh-76px)] overflow-y-auto">
              <RecentViewedPanel
                items={filteredItems}
                showTodayOnly={showTodayOnly}
                sortMode={sortMode}
                wishlist={wishlist}
                onToggleToday={() => setShowTodayOnly((prev) => !prev)}
                onSortChange={setSortMode}
                onSelect={handleSelect}
                onToggleWishlist={(id) => void handleToggleWishlist(id)}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
