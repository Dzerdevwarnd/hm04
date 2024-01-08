import mongoose from 'mongoose'

export type ipRequest = {
	ip: any
	URL: string
	date: Date
	dateToDelete: Date
}

const ipRequestSchema = new mongoose.Schema({
	ip: { type: String, required: true },
	URL: { type: String, required: true },
	date: { type: Date, required: true },
	dateToDelete: { type: Date, required: true },
})

export const ipRequestModel = mongoose.model('ipRequests', ipRequestSchema)

export const ipRequestRepository = {
	async findRequestsToUrl(ipAndUrl: { ip: any; url: string }) {
		const ipRequests = await ipRequestModel
			.find({ ip: ipAndUrl.ip, URL: ipAndUrl.url })
			.lean()
		return ipRequests
	},
	async addIpRequest(ipRequest: {
		ip: any
		URL: string
		date: Date
		dateToDelete: Date
	}) {
		const result = await ipRequestModel.insertMany(ipRequest)
		return result.length == 1
	},
	async deleteIpRequest(ipAndUrl: { ip: any; url: string }) {
		const result = await ipRequestModel.deleteOne({
			ip: ipAndUrl.ip,
			URL: ipAndUrl.url,
		})
		return result.deletedCount == 1
	},
}
