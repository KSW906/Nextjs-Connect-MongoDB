import { Facebook, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="text-2xl">🌿</div>
              <span className="text-xl font-semibold text-green-700">PlantShop</span>
            </div>
            <p className="mb-4 text-sm text-gray-600">건강한 식물과 함께하는 행복한 일상</p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 font-semibold">고객센터</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>이메일: support@plantshop.com</p>
              <p>전화: 1588-0000</p>
              <p>운영시간: 평일 09:00 - 18:00</p>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="mb-4 font-semibold">사업자 정보</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>상호: (주)플랜트샵</p>
              <p>대표: 홍길동</p>
              <p>사업자등록번호: 123-45-67890</p>
              <p>주소: 서울시 강남구 테헤란로 123</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-gray-600">© 2026 PlantShop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 transition-colors hover:text-green-600">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 transition-colors hover:text-green-600">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-600 transition-colors hover:text-green-600">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
