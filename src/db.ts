import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'
import { postType } from './repositories/PostsRepository'
import { blogType } from './repositories/blogsRepository'
import { settings } from './setting'

dotenv.config()

const dbName = 'home_works'
const mongoUri = settings.MONGO_URL || `mongodb://0.0.0.0:27017/${1}`
console.log('url:', mongoUri)
if (!mongoUri) {
	throw new Error("Url doesn't found")
}
export const client = new MongoClient(mongoUri)

export const blogsCollection = client.db().collection<blogType>('blogs')
export const postsCollection = client.db().collection<postType>('posts')

export async function runDb() {
	try {
		await mongoose.connect(settings.MONGO_URL)
		console.log('it is ok')
	} catch (e) {
		console.log('no connection')
		await mongoose.disconnect()
	}
}
