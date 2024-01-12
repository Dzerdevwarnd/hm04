import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import { settings } from './setting'

dotenv.config()

const dbName = 'home_Works'
const mongoUri = settings.MONGO_URL || `mongodb://0.0.0.0:27017/${1}`
console.log('url:', mongoUri)
if (!mongoUri) {
	throw new Error("Url doesn't found")
}

export async function runDb() {
	try {
		await mongoose.connect(mongoUri)
		console.log('it is ok')
	} catch (e) {
		console.log('no connection')
		await mongoose.disconnect()
	}
}
