import bcrypt from 'bcrypt'
import {
	UserDbType,
	userViewType,
	usersPaginationType,
	usersRepository,
} from '../repositories/UsersRepository'

export const userService = {
	async returnAllUsers(query: any): Promise<usersPaginationType> {
		return await usersRepository.returnAllUsers(query)
	},
	async createUser(body: {
		login: string
		password: string
		email: string
	}): Promise<userViewType> {
		const passwordSalt = await bcrypt.genSalt(10)
		const passwordHash = await this.generateHash(body.password, passwordSalt)
		const createdDate = new Date()
		const newUser: UserDbType = {
			id: String(Date.now()),
			login: body.login,
			email: body.email,
			createdAt: createdDate,
			passwordSalt: passwordSalt,
			passwordHash: passwordHash,
		}
		const userView = await usersRepository.createUser(newUser)
		return userView
	},
	async deleteUser(params: { id: string }): Promise<boolean> {
		let resultBoolean = await usersRepository.deleteUser(params)
		return resultBoolean
	},
	async generateHash(password: string, passwordSalt: string) {
		const hash = await bcrypt.hash(password, passwordSalt)
		return hash
	},
	async checkCreditionals(loginOrEmail: string, password: string) {
		const user = await usersRepository.findDBUser(loginOrEmail)
		if (!user) {
			return false
		}
		if (
			user.passwordHash !==
			(await this.generateHash(password, user.passwordSalt))
		) {
			return false
		} else {
			return true
		}
	},
}
