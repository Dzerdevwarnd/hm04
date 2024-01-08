import mongoose from 'mongoose'

export type commentType = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: Date
}

export type commentDBType = {
	id: string
	postId: string
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

const commentSchema = new mongoose.Schema({
	id: { type: String, required: true },
	postId: { type: String, required: true },
	content: { type: String, required: true },
	commentatorInfo: {
		type: {
			userId: { type: String, required: true },
			userLogin: { type: String, required: true },
		},
		required: true,
	},
	createdAt: { type: Date, required: true },
})

export const commentModel = mongoose.model('comments', commentSchema)

export const commentsRepository = {
	async findComment(id: string): Promise<commentType | null> {
		const foundComment = await commentModel.findOne(
			{ id: id },
			{ projection: { _id: 0, postId: 0 } }
		)
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
		const comments = await commentModel
			.find({ postId: id }, { projection: { _id: 0, postId: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection, createdAt: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await commentModel.countDocuments({ postId: id })
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
		const resultOfDelete = await commentModel.deleteOne({ id: id })
		return resultOfDelete.deletedCount === 1
	},

	async updateComment(id: string, body: { content: string }): Promise<boolean> {
		const resultOfUpdate = await commentModel.updateOne(
			{ id: id },
			{
				$set: {
					content: body.content,
				},
			}
		)
		return resultOfUpdate.matchedCount === 1
	},

	async createComment(newComment: commentDBType): Promise<commentType> {
		const result = await commentModel.insertMany(newComment)
		//@ts-ignore
		const { _id, postId, ...commentWithout_Id } = newComment
		return commentWithout_Id
	},
}
