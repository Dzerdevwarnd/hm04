import add from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import { jwtService } from '../application/jwt-service'
import {
	UserDbType,
	userViewType,
	usersRepository,
} from '../repositories/UsersRepository'
import { blacklistRepository } from '../repositories/blacklistRepository'
import { userService } from '../services/usersService'
import { settings } from '../setting'

export const authService = {
	async loginAndReturnJwtKeys(
		loginOrEmail: string,
		password: string,
		deviceId: string
	) {
		const user = await userService.checkCredentialsAndReturnUser(
			loginOrEmail,
			password
		)
		if (!user) {
			return
		} else {
			const accessToken = await jwtService.createAccessToken(
				user,
				settings.accessTokenLifeTime
			)
			const refreshToken = await jwtService.createRefreshToken(
				deviceId,
				settings.refreshTokenLifeTime
			)
			return { accessToken: accessToken, refreshToken: refreshToken }
		}
	},
	async refreshTokens(user: UserDbType) {
		const accessToken = await jwtService.createJWT(
			user,
			settings.accessTokenLifeTime
		)
		const refreshToken = await jwtService.createJWT(
			user,
			settings.refreshTokenLifeTime
		)
		return { accessToken: accessToken, refreshToken: refreshToken }
	},
	async createUser(
		password: string,
		email: string,
		login: string
	): Promise<userViewType> {
		const passwordSalt = await userService.generateSalt()
		const passwordHash = await userService.generateHash(password, passwordSalt)
		const createdDate = new Date()
		const newUser: UserDbType = {
			id: String(Date.now()),
			accountData: {
				login: login,
				email: email,
				createdAt: createdDate,
				passwordSalt: passwordSalt,
				passwordHash: passwordHash,
			},
			emailConfirmationData: {
				confirmationCode: uuidv4(),
				expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
				isConfirmed: false,
			},
		}
		const userView = await usersRepository.createUser(newUser)
		return userView
	},
	async addTokensInBlacklist(
		reqBody: { accessToken: string },
		reqCookies: { refreshToken: string }
	) {
		const isAdded = await blacklistRepository.addTokensInBlacklist(
			reqBody,
			reqCookies
		)
		return isAdded
	},
}
