import jwt from 'jsonwebtoken'
import { UserDbType } from '../repositories/UsersRepository'
import { settings } from '../setting'

export const jwtService = {
	async createJWT(user: UserDbType, expirationTime: string) {
		const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
			expiresIn: expirationTime,
		})
		return token
	},
	async verifyAndGetUserIdByToken(token: string) {
		try {
			const result: any = await jwt.verify(token, settings.JWT_SECRET)
			return result.userId
		} catch (error) {
			return
		}
	},
}
