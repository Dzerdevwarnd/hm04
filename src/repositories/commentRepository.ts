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

export const commentsRepository = {
	async findComment(id: string): Promise<commentType | null> {
		const foundComment = await client
			.db('hm03')
			.collection<commentType>('comments')
			.findOne({ id: id })
		return foundComment
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
}
