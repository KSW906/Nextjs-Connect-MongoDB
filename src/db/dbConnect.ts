/* eslint-disable no-var */
// db\dbConnect.ts
import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error(
      'Missing MONGODB_URI environment variable. Add it to .env or your deployment environment.'
    )
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }
    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => mongoose.connection)
      .catch((e) => {
        cached.promise = null
        throw new Error(
          `MongoDB connection failed. Check your MONGODB_URI and network access: ${
            e instanceof Error ? e.message : JSON.stringify(e)
          }`
        )
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
