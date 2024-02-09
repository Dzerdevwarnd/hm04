import mongoose from 'mongoose'

export class commentLikeDBType {
	constructor(
		public userId: string,
		public commentId: string,
		public likeStatus: string
	) {}
}

const commentLikeSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	commentId: { type: String, required: true },
	likeStatus: { type: String, required: true },
})

export const commentLikeModel = mongoose.model(
	'commentsLikes',
	commentLikeSchema
)

export const commentLikesRepository = {
	async findCommentLikeFromUser(userId: string, commentId: string) {
		const like = await commentLikeModel.findOne({
			userId: userId,
			commentId: commentId,
		})
		return like
	},

	async addLikeToBdFromUser(like: {
		userId: string
		commentId: string
		likeStatus: string
	}) {
		const result = await commentLikeModel.insertMany(like)
		return result.length == 1
	},
	async updateUserLikeStatus(
		userId: string,
		commentId: string,
		likeStatus: string
	) {
		const result = await commentLikeModel.updateOne(
			{ userId: userId, commentId: commentId },
			{ likeStatus: likeStatus }
		)
		return result.modifiedCount == 1
	},
}
