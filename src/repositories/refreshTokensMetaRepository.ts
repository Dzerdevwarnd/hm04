import mongoose from 'mongoose'
import { jwtService } from '../application/jwt-service'
import { client } from '../db'
import { settings } from '../setting'

export type refreshTokensMetaTypeDB = {
	userId: string
	deviceId: string
	title: string
	ip: any
	lastActiveDate: Date
	expiredAt: Date
}

const refreshTokensMetaSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	deviceId: { type: String, required: true },
	title: { type: String, required: true },
	ip: { type: String, required: true },
	lastActiveDate: { type: Date, required: true },
	expiredAt: { type: Date, required: true },
})

export const refreshTokensMetaModel = mongoose.model(
	'refreshTokensMeta',
	refreshTokensMetaSchema
)

export const refreshTokensMetaRepository = {
	async createRefreshToken(refreshTokenMeta: refreshTokensMetaTypeDB) {
		const expireDate = new Date( //@ts-ignore
			Date.now() + parseInt(settings.refreshTokenLifeTime.match(/\d+/))
		)
		await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 })
		const result = await refreshTokensMetaModel.insertMany(refreshTokenMeta)

		setTimeout(
			() =>
				refreshTokensMetaModel.deleteOne({
					deviceId: refreshTokenMeta.deviceId,
				}),
			parseInt(settings.refreshTokenLifeTime)
		)

		return result.length == 1
	},
	async updateRefreshTokenMeta(
		deviceId: string,
		refreshTokenMetaUpd: { lastActiveDate: Date; expiredAt: Date }
	) {
		const result = await refreshTokensMetaModel.updateOne(
			{ deviceId: deviceId },
			{
				$set: {
					lastActiveDate: refreshTokenMetaUpd.lastActiveDate,
					expiredAt: refreshTokenMetaUpd.expiredAt,
				},
			}
		)
		return result.matchedCount === 1
	},
	async findUserIdByDeviceId(deviceId: string) {
		const refreshTokenMeta = await refreshTokensMetaModel.findOne({
			deviceId: deviceId,
		})
		const userId = refreshTokenMeta?.userId
		return userId
	},
	async returnAllUserDevices(refreshToken: string) {
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(refreshToken)
		if (!deviceId) {
			return
		}
		const UserId = await this.findUserIdByDeviceId(deviceId)
		const devicesDB = await refreshTokensMetaModel
			.find({ userId: UserId })
			.lean()
		const devicesView = []
		for (let i = 0; i < devicesDB.length; i++) {
			let deviceView = {
				ip: devicesDB[i].ip,
				title: devicesDB[i].title,
				deviceId: devicesDB[i].deviceId,
				lastActiveDate: devicesDB[i].lastActiveDate,
			}
			devicesView.push(deviceView)
		}
		return devicesView
	},
	async deleteAllUserDevices(refreshToken: string) {
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(refreshToken)
		if (!deviceId) {
			return
		}
		const UserId = await this.findUserIdByDeviceId(deviceId)
		const resultOfDelete = await refreshTokensMetaModel.deleteMany({
			deviceId: { $ne: deviceId },
			userId: UserId,
		})
		return resultOfDelete.acknowledged
	},
	async deleteOneUserDeviceAndReturnStatusCode(
		requestDeviceId: string,
		refreshToken: string
	) {
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(refreshToken)
		if (!deviceId) {
			return 401
		}
		const requestRefreshTokensMeta = await refreshTokensMetaModel.findOne({
			deviceId: requestDeviceId,
		})
		if (!requestRefreshTokensMeta) {
			return 404
		}
		const userId = await this.findUserIdByDeviceId(deviceId)
		if (userId !== requestRefreshTokensMeta?.userId) {
			return 403
		}
		const resultOfDelete = await refreshTokensMetaModel.deleteOne({
			deviceId: requestDeviceId,
		})
		if (resultOfDelete.deletedCount === 0) {
			return 404
		}
		return 204
	},
}
