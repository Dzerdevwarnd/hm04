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

export const refreshTokensMetaRepository = {
	async createRefreshToken(refreshTokenMeta: refreshTokensMetaTypeDB) {
		const expireDate = new Date( //@ts-ignore
			Date.now() + parseInt(settings.refreshTokenLifeTime.match(/\d+/))
		)
		await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 })
		const result = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.insertOne(refreshTokenMeta)
		return result.acknowledged
	},
	async updateRefreshTokenMeta(
		deviceId: string,
		refreshTokenMetaUpd: { lastActiveDate: Date; expiredAt: Date }
	) {
		const result = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.updateOne(
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
		const refreshTokenMeta = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.findOne({ deviceId: deviceId })
		const userId = refreshTokenMeta?.userId
		return userId
	},
	async returnAllUserDevices(refreshToken: string) {
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(refreshToken)
		if (!deviceId) {
			return
		}
		const UserId = await this.findUserIdByDeviceId(deviceId)
		const devicesDB = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.find({ userId: UserId })
			.toArray()
		const devicesView = []
		for (let i = 0; i < devicesDB.length; i++) {
			const deviceView = {
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
		const resultOfDelete = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.deleteMany({ userId: UserId })
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
		const refreshTokensMeta = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.findOne({ deviceId: requestDeviceId })
		if (!refreshTokensMeta) {
			return 404
		}
		if (deviceId !== requestDeviceId) {
			console.log(deviceId)
			console.log(requestDeviceId)
			return 403
		}
		const UserId = await this.findUserIdByDeviceId(deviceId)
		const resultOfDelete = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.deleteOne({ deviceId: deviceId })
		if (!resultOfDelete.acknowledged) {
			return 404
		}
		return 204
	},
}
