import jwt from 'jsonwebtoken'
import { UserDbType } from '../repositories/UsersRepository'
import { settings } from '../setting'

export const jwtService = {
	async createJWT(user: UserDbType) {
		const token = jwt.sign({ userId: user.id }, settings.JWT_SECRET, {
			expiresIn: '1h',
		})
		return token
	},
	async getUserIdByToken(token: string) {
		try {
			const result: any = jwt.verify(token, settings.JWT_SECRET)
			return result.userId
		} catch (error) {
			return null
		}
	},
}
