import { client } from '../db'

export type userViewType = {
	id: string
	login: string
	email: string
	createdAt: Date
}

export type UserDbType = {
	id: string
	login: string
	email: string
	createdAt: Date
	passwordSalt: string
	passwordHash: string
}

export type usersPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: userViewType[]
}

export const usersRepository = {
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
			.find(
				{
					login: { $regex: searchLoginTerm, $options: 'i' },
					email: { $regex: searchEmailTerm, $options: 'i' },
				},
				{ projection: { _id: 0 } }
			)
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.toArray()
		const totalCount = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.countDocuments({
				login: { $regex: searchLoginTerm, $options: 'i' },
				email: { $regex: searchEmailTerm, $options: 'i' },
			})
		const pagesCount = Math.ceil(totalCount / pageSize)
		const usersPagination = {
			pagesCount: pagesCount,
			page: Number(page),
			pageSize: pageSize,
			totalCount: totalCount,
			items: users,
		}
		return usersPagination
	},

	async findDBUser(loginOrEmail: string): Promise<UserDbType | undefined> {
		let user = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })
		//@ts-ignore
		return user
	},

	async createUser(newUser: UserDbType): Promise<userViewType> {
		const result = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.insertOne(newUser)
		//@ts-ignore
		const { _id, passwordHash, passwordSalt, ...userView } = newUser
		return userView
	},

	async deleteUser(params: { id: string }): Promise<boolean> {
		let result = await client
			.db('hm03')
			.collection<UserDbType>('users')
			.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
