import jwt from 'jsonwebtoken'
import { UserDbType } from '../repositories/UsersRepository'
import { settings } from '../setting'

export const jwtService = {
	async createAccessToken(user: UserDbType, expirationTime: string) {
		const AccessToken = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
			expiresIn: expirationTime,
		})
		return AccessToken
	},
	async createRefreshToken(deviceId: string, expirationTime: string) {
		const RefreshToken = jwt.sign({ deviceId: deviceId }, settings.JWT_SECRET, {
			expiresIn: expirationTime,
		})
		return RefreshToken
	},
	async verifyAndGetUserIdByToken(token: string) {
		try {
			const result: any = await jwt.verify(token, settings.JWT_SECRET)
			return result.userId
		} catch (error) {
			return
		}
	},
	async verifyAndGetDeviceIdByToken(token: string) {
		try {
			const result: any = await jwt.verify(token, settings.JWT_SECRET)
			return result.deviceId
		} catch (error) {
			return
		}
	},
}
