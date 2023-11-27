import bcrypt from 'bcrypt'
import add from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import {
	UserDbType,
	userViewType,
	usersPaginationType,
	usersRepository,
} from '../repositories/UsersRepository'

export const userService = {
	async findUser(id: string): Promise<UserDbType | null> {
		let user = await usersRepository.findUser(id)
		return user
	},
	async returnAllUsers(query: any): Promise<usersPaginationType> {
		return await usersRepository.returnAllUsers(query)
	},
	async createUser(body: {
		login: string
		password: string
		email: string
	}): Promise<userViewType> {
		const passwordSalt = await this.generateSalt()
		const passwordHash = await this.generateHash(body.password, passwordSalt)
		const createdDate = new Date()
		const newUser: UserDbType = {
			id: String(Date.now()),
			accountData: {
				login: body.login,
				email: body.email,
				createdAt: createdDate,
				passwordSalt: passwordSalt,
				passwordHash: passwordHash,
			},
			emailConfirmationData: {
				confirmationCode: uuidv4,
				expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
				isConfirmed: true,
			},
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
	async generateSalt() {
		const salt = await bcrypt.genSalt(10)
		return salt
	},
	async checkCredentialsAndReturnUser(
		loginOrEmail: string,
		password: string
	): Promise<UserDbType | undefined> {
		const user = await usersRepository.findDBUser(loginOrEmail)
		if (!user) {
			return undefined
		}
		if (
			user.accountData.passwordHash !==
			(await this.generateHash(password, user.accountData.passwordSalt))
		) {
			return undefined
		} else {
			return user
		}
	},
	async userEmailConfirmationAccept(confirmationCode: any): Promise<Boolean> {
		const isConfirmationAccept =
			await usersRepository.userEmailConfirmationAccept(confirmationCode)
		return isConfirmationAccept
	},
	async findDBUserByConfirmationCode(confirmationCode: any) {
		const user = await usersRepository.findDBUserByConfirmationCode(
			confirmationCode
		)
		return user
	},
}
