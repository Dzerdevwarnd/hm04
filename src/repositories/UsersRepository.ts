import { v4 as uuidv4 } from 'uuid'
import { client } from '../db'

export type userViewType = {
	id: string
	login: string
	email: string
	createdAt: Date
}

export type UserDbType = {
	id: string
	accountData: {
		login: string
		email: string
		createdAt: Date
		passwordSalt: string
		passwordHash: string
	}
	emailConfirmationData: {
		confirmationCode: any
		expirationDate: Date
		isConfirmed: boolean
	}
}

export type usersPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: userViewType[]
}

export const usersRepository = {
	async findUser(id: string): Promise<UserDbType | null> {
		const user = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.findOne({ id: id })
		return user
	},

	async returnAllUsers(query: any): Promise<usersPaginationType> {
		const pageSize = Number(query.pageSize) || 10
		const page = Number(query.pageNumber) || 1
		const sortBy: string = query.sortBy || 'createdAt'
		const searchLoginTerm: string = query.searchLoginTerm || ''
		const searchEmailTerm: string = query.searchEmailTerm || ''
		let sortDirection = query.sortDirection || 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const users = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.find({
				$or: [
					{ 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
					{ 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
				],
			})
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.toArray()
		const totalCount = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.countDocuments({
				$or: [
					{ 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
					{ 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
				],
			})
		const pagesCount = Math.ceil(totalCount / pageSize)
		const usersView = users.map(({ id, accountData }) => ({
			id,
			login: accountData.login,
			email: accountData.email,
			createdAt: accountData.createdAt,
		}))
		const usersPagination = {
			pagesCount: pagesCount,
			page: Number(page),
			pageSize: pageSize,
			totalCount: totalCount,
			items: usersView,
		}
		return usersPagination
	},

	async findDBUser(loginOrEmail: string): Promise<UserDbType | undefined> {
		let user = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.findOne({
				$or: [
					{ 'accountData.email': loginOrEmail },
					{ 'accountData.login': loginOrEmail },
				],
			})
		//@ts-ignore
		return user
	},

	async createUser(newUser: UserDbType): Promise<userViewType> {
		const result = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.insertOne(newUser)
		//@ts-ignore
		const userView = {
			id: newUser.id,
			login: newUser.accountData.login,
			email: newUser.accountData.login,
			createdAt: newUser.accountData.createdAt,
		}
		return userView
	},

	async deleteUser(params: { id: string }): Promise<boolean> {
		const result = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
	async userEmailConfirmationAccept(confirmationCode: any): Promise<Boolean> {
		const user = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.findOne({ 'emailConfirmationData.confirmationCode': confirmationCode })
		if (!user) {
			return false
		}
		if (new Date() > user?.emailConfirmationData.expirationDate) {
			return false
		}
		const resultOfUpdate = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.updateOne(
				{ 'emailConfirmationData.confirmationCode': confirmationCode },
				{ $set: { 'emailConfirmationData.isConfirmed': true } }
			)
		return resultOfUpdate.modifiedCount === 1
	},

	async userConfirmationCodeUpdate(email: string) {
		const confirmationCode = await uuidv4()
		const resultOfUpdate = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.updateOne(
				{ 'accountData.email': email },
				{ $set: { 'emailConfirmationData.confirmationCode': confirmationCode } }
			)
		if (resultOfUpdate.matchedCount === 1) {
			return confirmationCode
		} else {
			return
		}
	},
	async findDBUserByConfirmationCode(confirmationCode: any) {
		const user = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.findOne({ 'emailConfirmationData.confirmationCode': confirmationCode })
		return user
	},
}
//
