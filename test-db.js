import dbConnect from './src/db/dbConnect'

async function test() {
  try {
    const conn = await dbConnect()
    console.log('Connected to MongoDB')
    console.log('Database:', conn.db.databaseName)
  } catch (error) {
    console.error('Connection error:', error)
  }
}

test()
