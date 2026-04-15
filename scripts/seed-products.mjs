import fs from 'fs'
import path from 'path'
import vm from 'vm'
import mongoose from 'mongoose'

const projectRoot = process.cwd()
const mockProductsPath = path.join(projectRoot, 'src', 'data', 'mockProducts.ts')
const envPath = path.join(projectRoot, '.env')

function readMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI.trim()
  }

  const envText = fs.readFileSync(envPath, 'utf8')
  const line = envText
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry && !entry.startsWith('#') && entry.startsWith('MONGODB_URI='))

  if (!line) {
    throw new Error('MONGODB_URI was not found in .env')
  }

  return line.slice('MONGODB_URI='.length).trim()
}

function loadMockProducts() {
  const source = fs.readFileSync(mockProductsPath, 'utf8')
  const match = source.match(/export const mockProducts:\s*Product\[\]\s*=\s*(\[[\s\S]*?\n\])/)

  if (!match) {
    throw new Error('Could not locate mockProducts in src/data/mockProducts.ts')
  }

  const sandbox = {
    productImage: (fileName) => `/images/products/${fileName}`,
  }
  const script = new vm.Script(`mockProducts = ${match[1]}`)
  vm.createContext(sandbox)
  script.runInContext(sandbox)

  return sandbox.mockProducts
}

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    careInstructions: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    collection: 'products',
    versionKey: false,
  }
)

const Product = mongoose.models.ProductForSeed || mongoose.model('ProductForSeed', productSchema)

async function seedProducts() {
  const uri = readMongoUri()
  const mockProducts = loadMockProducts()

  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  })

  const operations = mockProducts.map((product) => ({
    updateOne: {
      filter: { id: product.id },
      update: {
        $set: {
          ...product,
          createdAt: new Date(product.createdAt),
        },
      },
      upsert: true,
    },
  }))

  const result = await Product.bulkWrite(operations, { ordered: true })
  const totalCount = await Product.countDocuments()

  console.log(
    JSON.stringify(
      {
        message: 'Products seeded successfully.',
        source: 'src/data/mockProducts.ts',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
        totalCount,
      },
      null,
      2
    )
  )
}

seedProducts()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
