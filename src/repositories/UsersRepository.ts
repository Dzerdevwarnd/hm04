import { client } from '../db'

export type userType = {
	id: string
	login: string
	email: string
	createdAt: Date
}

export type usersPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: userType[]
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
			.collection<userType>('users')
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
			.collection<userType>('users')
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

	async createUser(newUser: userType): Promise<userType> {
		const result = await client
			.db('hm03')
			.collection<userType>('users')
			.insertOne(newUser)
		//@ts-ignore
		const { _id, ...blogWithout_Id } = newUser
		return newUser
	},

	async deleteUser(params: { id: string }): Promise<boolean> {
		let result = await client
			.db('hm03')
			.collection<userType>('users')
			.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
