import Product from '@/db/models/product'
import { mockProducts } from '@/data/mockProducts'

export async function ensureProductDocumentById(productId: string) {
  const existingProduct = await Product.findOne({ id: productId })
  if (existingProduct) {
    return existingProduct
  }

  const mockProduct = mockProducts.find((product) => product.id === productId)
  if (!mockProduct) {
    return null
  }

  return Product.findOneAndUpdate(
    { id: productId },
    {
      $setOnInsert: {
        id: mockProduct.id,
        name: mockProduct.name,
        description: mockProduct.description,
        detailedDescription: mockProduct.detailedDescription,
        careInstructions: mockProduct.careInstructions,
        price: mockProduct.price,
        stock: mockProduct.stock,
        category: mockProduct.category,
        image: mockProduct.image,
        createdAt: new Date(mockProduct.createdAt),
      },
    },
    {
      new: true,
      upsert: true,
    }
  )
}
