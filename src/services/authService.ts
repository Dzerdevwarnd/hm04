import add from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import { emailAdapter } from '../adapters/emailAdapter'
import { jwtService } from '../application/jwt-service'
import {
	UserDbType,
	userViewType,
	usersRepository,
} from '../repositories/UsersRepository'
import { userService } from '../services/usersService'

export const authService = {
	async loginAndReturnJwtKey(loginOrEmail: string, password: string) {
		const user = await userService.checkCredentionalsAndReturnUser(
			loginOrEmail,
			password
		)
		if (user == undefined) {
			return
		} else {
			const token = await jwtService.createJWT(user)
			const accessToken = { accessToken: token }
			return accessToken
		}
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
		if (userView) {
			emailAdapter.sendConfirmEmail(email)
		}
		return userView
	},
}
