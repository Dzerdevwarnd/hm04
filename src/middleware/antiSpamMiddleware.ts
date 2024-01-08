import { NextFunction, Request, Response } from 'express'
import { ipRequestRepository } from '../repositories/ipRequestsRepository'

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
	const url = req.originalUrl
	const ipRequests = await ipRequestRepository.findRequestsToUrl({
		ip: ipAddress,
		url: url,
	})
	if (ipRequests.length >= 5) {
		res.sendStatus(429)
		return
	}
	const date = new Date()
	const dateToDelete = new Date(Date.now() + 10000)
	const ipRequest = {
		ip: ipAddress,
		URL: url,
		date: date,
		dateToDelete: dateToDelete,
	}

	const result = await ipRequestRepository.addIpRequest(ipRequest)
	setTimeout(() => {
		ipRequestRepository.deleteIpRequest({
			ip: ipAddress,
			url: url,
		})
	}, 13000)
	next()
}
