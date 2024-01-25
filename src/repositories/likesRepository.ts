import mongoose from 'mongoose'

export class LikeDBType {
	constructor(
		public userId: string,
		public commentId: string,
		public likeStatus: string
	) {}
}

const likeSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	commentId: { type: String, required: true },
	likeStatus: { type: String, required: true },
})

export const likeModel = mongoose.model('likes', likeSchema)

export const likesRepository = {
	async findCommentLikeFromUser(userId: string, commentId: string) {
		const like = await likeModel.findOne({
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
		const result = await likeModel.insertMany(like)
		return result.length == 1
	},
	async updateUserLikeStatus(
		userId: string,
		commentId: string,
		likeStatus: string
	) {
		const result = await likeModel.updateOne(
			{ userId: userId, commentId: commentId },
			{ likeStatus: likeStatus }
		)
		return result.modifiedCount == 1
	},
}
