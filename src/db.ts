import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import { postType } from './repositories/PostsRepository'
import { blogType } from './repositories/blogsRepository'

dotenv.config()

const mongoUri =
	'mongodb+srv://admin:qwerty123@cluster0.hzh4nyr.mongodb.net/?retryWrites=true&w=majority'
console.log('url:', mongoUri)
if (!mongoUri) {
	throw new Error("Url doesn't found")
}
export const client = new MongoClient(mongoUri)

export const blogsCollection = client.db().collection<blogType>('blogs')
export const postsCollection = client.db().collection<postType>('posts')

export const runDb = async () => {
	try {
		await client.connect()
		console.log('Connect successfully to server')
	} catch (e) {
		console.log('Server connect ERROR')
		await client.close()
	}
}
