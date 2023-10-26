import {
	userType,
	usersPaginationType,
	usersRepository,
} from '../repositories/UsersRepository'

export const UserService = {
	async returnAllUsers(query: any): Promise<usersPaginationType> {
		return usersRepository.returnAllUsers(query)
	},
	async createUser(body: {
		login: string
		password: string
		email: string
	}): Promise<userType> {
		const createdDate = new Date()
		const newUser: userType = {
			id: String(Date.now()),
			login: body.login,
			email: body.email,
			createdAt: createdDate,
		}
		const newUserWithout_id = usersRepository.createUser(newUser)
		return newUserWithout_id
	},
	async deleteUser(params: { id: string }): Promise<boolean> {
		let resultBoolean = UserService.deleteUser(params)
		return resultBoolean
	},
}
