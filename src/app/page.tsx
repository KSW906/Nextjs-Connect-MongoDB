'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import { useShop } from '@/context/ShopContext'
import { SortOption } from '@/types'
import { categories } from '@/data/mockProducts'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'

export default function HomePage() {
  const { products } = useShop()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [isLoading, setIsLoading] = useState(true)

  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== '전체') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered]
    switch (sortBy) {
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
    }

    return sorted
  }, [products, selectedCategory, sortBy, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-r from-green-600 to-green-800 md:h-96">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1563419837758-e48ef1b731dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3R0ZWQlMjBwbGFudCUyMGluZG9vcnxlbnwxfHx8fDE3NzM1NDE4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Banner"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="text-white">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">건강한 식물과 함께</h1>
            <p className="mb-6 text-lg md:text-xl">집에서 키우는 작은 정원, 지금 시작하세요</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Result Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-lg">
              '<span className="font-semibold">{searchQuery}</span>' 검색 결과{' '}
              <span className="text-gray-600">({filteredAndSortedProducts.length}개)</span>
            </p>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="정렬" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="price-asc">가격 낮은순</SelectItem>
              <SelectItem value="price-desc">가격 높은순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-2 text-lg text-gray-600">상품을 찾을 수 없습니다</p>
            <p className="text-sm text-gray-500">다른 검색어나 카테고리를 선택해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
