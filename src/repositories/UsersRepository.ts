import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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

const userSchema = new mongoose.Schema({
	id: { type: String, required: true },
	accountData: {
		type: {
			login: { type: String, required: true },
			email: { type: String, required: true },
			createdAt: { type: Date, required: true },
			passwordSalt: { type: String, required: true },
			passwordHash: { type: String, required: true },
		},
		required: true,
	},
	emailConfirmationData: {
		type: {
			confirmationCode: { type: String, required: true },
			expirationDate: { type: Date, required: true },
			isConfirmed: { type: Boolean, required: true },
		},
		required: true,
	},
})

export const userModel = mongoose.model('users', userSchema)

export const usersRepository = {
	async findUser(id: string): Promise<UserDbType | null> {
		const user = await userModel.findOne({ id: id })
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
		const users = await userModel
			.find({
				$or: [
					{ 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
					{ 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
				],
			})
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await userModel.countDocuments({
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
		let user = await userModel.findOne({
			$or: [
				{ 'accountData.email': loginOrEmail },
				{ 'accountData.login': loginOrEmail },
			],
		})
		//@ts-ignore
		return user
	},

	async createUser(newUser: UserDbType): Promise<userViewType> {
		const result = await userModel.insertMany(newUser)
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
		const result = await userModel.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
	async userEmailConfirmationAccept(confirmationCode: any): Promise<Boolean> {
		const resultOfUpdate = await userModel.updateOne(
			{ 'emailConfirmationData.confirmationCode': confirmationCode },
			{ $set: { 'emailConfirmationData.isConfirmed': true } }
		)
		return resultOfUpdate.modifiedCount === 1
	},

	async userConfirmationCodeUpdate(email: string) {
		const confirmationCode = await uuidv4()
		const resultOfUpdate = await userModel.updateOne(
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
		const user = await userModel.findOne({
			'emailConfirmationData.confirmationCode': confirmationCode,
		})
		return user
	},
}
//
