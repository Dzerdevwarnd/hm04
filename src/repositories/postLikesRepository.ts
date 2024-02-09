import mongoose from 'mongoose'

export class postLikeDBType {
	public addedAt: Date
	constructor(
		public userId: string,
		public postId: string,
		public likeStatus: string,
		public login: string = 'string'
	) {
		this.addedAt = new Date()
	}
}

export class postLikeViewType {
	public addedAt: Date
	constructor(
		public userId: string,
		public login: string = 'string'
	) {
		this.addedAt = new Date()
	}

}

const postLikeSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	postId: { type: String, required: true },
	likeStatus: { type: String, required: true },
	login: { type: String, required: true, default: 'string' },
	addedAt: { type: Date, required: true },
})

export const postLikeModel = mongoose.model('postsLikes', postLikeSchema)

export const postLikesRepository = {
	async findPostLikeFromUser(userId: string, postId: string) {
		const like = await postLikeModel.findOne({
			userId: userId,
			postId: postId,
		})
		return like
	},

	async findLast3Likes(postId: string):Promise<postLikeViewType[]> {
		const last3Likes = await postLikeModel
			.find({ postId: postId,likeStatus:"Like" }, { addedAt: 1, userId: 1, login: 1 })
			.sort({ addedAt: -1 })
			.limit(3)
			.lean()
		return last3Likes
	},

	async addLikeToBdFromUser(like: {
		userId: string
		postId: string
		likeStatus: string
		login: string
	}) {
		const result = await postLikeModel.insertMany(like)
		return result.length == 1
	},
	async updateUserLikeStatus(
		userId: string,
		postId: string,
		likeStatus: string
	) {
		const result = await postLikeModel.updateOne(
			{ userId: userId, postId: postId },
			{ likeStatus: likeStatus }
		)
		return result.modifiedCount == 1
	},
}
