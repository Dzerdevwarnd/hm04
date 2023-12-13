import { NextFunction, Request, Response } from 'express'
import { client } from '../db'

export type ipRequest = {
	ip: any
	URL: string
	date: Date
	dateToDelete: Date
}

export const antiSpamMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const ipAddress =
		req.ip ||
		req.headers['x-forwarded-for'] ||
		req.headers['x-real-ip'] ||
		req.socket.remoteAddress
	const url = req.baseUrl
	const date = new Date()
	const dateToDelete = new Date(Date.now() + 10000)
	const ipRequest = {
		ip: ipAddress,
		URL: url,
		date: date,
		dateToDelete: dateToDelete,
	}
	await client
		.db('hm03')
		.collection<ipRequest>('ipRequests')
		.createIndex({ dateToDelete: 1 }, { expireAfterSeconds: 0 })
	const result = await client
		.db('hm03')
		.collection<ipRequest>('ipRequests')
		.insertOne(ipRequest)
	next()
}
