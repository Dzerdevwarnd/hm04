import { client } from '../db'

export type commentType = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: Date
}

export type commentsPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: commentType[]
}

export const commentsRepository = {
	async findComment(id: string): Promise<commentType | null> {
		const foundComment = await client
			.db('hm03')
			.collection<commentType>('comments')
			.findOne({ id: id })
		return foundComment
	},

	async findCommentsByPostId(
		id: string,
		query: any
	): Promise<commentsPaginationType | null> {
		const pageSize = Number(query?.pageSize) || 10
		const page = Number(query?.pageNumber) || 1
		const sortBy: string = query?.sortBy ?? 'createdAt'
		let sortDirection = query?.sortDirection ?? 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const comments = await client
			.db('hm03')
			.collection<commentType>('comments')
			.find({ id: id }, { projection: { _id: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection, createdAt: sortDirection })
			.limit(pageSize)
			.toArray()
		const totalCount = await client
			.db('hm03')
			.collection<commentType>('comments')
			.countDocuments()
		const pagesCount = Math.ceil(totalCount / pageSize)
		const commentsPagination = {
			pagesCount: pagesCount,
			page: Number(page),
			pageSize: pageSize,
			totalCount: totalCount,
			items: comments,
		}
		return commentsPagination
	},

	async deleteComment(id: string): Promise<boolean> {
		const resultOfDelete = await client
			.db('hm03')
			.collection<commentType>('comments')
			.deleteOne({ id: id })
		return resultOfDelete.deletedCount === 1
	},

	async updateComment(id: string, body: { content: string }): Promise<boolean> {
		const resultOfUpdate = await client
			.db('hm03')
			.collection<commentType>('comments')
			.updateOne(
				{ id: id },
				{
					$set: {
						content: body.content,
					},
				}
			)
		return resultOfUpdate.matchedCount === 1
	},

	async createComment(newComment: commentType): Promise<commentType> {
		const result = await client
			.db('hm03')
			.collection<commentType>('comments')
			.insertOne(newComment)
		//@ts-ignore
		const { _id, ...commentWithout_Id } = newComment
		return commentWithout_Id
	},
}
