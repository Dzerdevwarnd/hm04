import { jwtService } from '../application/jwt-service'
import { client } from '../db'
import { settings } from '../setting'

export type refreshTokensMetaTypeDB = {
	userId: string
	deviceId: string
	deviceName: string
	ip: any
	usedAt: Date
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
		refreshTokenMetaUpd: { usedAt: Date; expiredAt: Date }
	) {
		const result = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.updateOne(
				{ deviceId: deviceId },
				{
					$set: {
						usedAt: refreshTokenMetaUpd.usedAt,
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
				tittle: devicesDB[i].deviceName,
				deviceId: devicesDB[i].deviceId,
				lastActive: devicesDB[i].usedAt,
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
	async deleteOneUserDevice(refreshToken: string) {
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(refreshToken)
		if (!deviceId) {
			return
		}
		const UserId = await this.findUserIdByDeviceId(deviceId)
		const resultOfDelete = await client
			.db('hm03')
			.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
			.deleteOne({ deviceId: deviceId })
		return resultOfDelete.acknowledged
	},
}
