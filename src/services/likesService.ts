import { LikeDBType, likesRepository } from '../repositories/likesRepository'

export const likesService = {
	async findCommentLikeFromUser(userId: string, commentId: string) {
		const like = await likesRepository.findCommentLikeFromUser(
			userId,
			commentId
		)
		return like
	},

	async addLikeToBdFromUser(
		userId: string,
		commentId: string,
		likeStatus: string
	) {
		const like = new LikeDBType(userId, commentId, likeStatus)
		const result = await likesRepository.addLikeToBdFromUser(like)
		return result
	},
	async updateUserLikeStatus(
		userId: string,
		commentId: string,
		likeStatus: string
	) {
		const result = likesRepository.updateUserLikeStatus(
			userId,
			commentId,
			likeStatus
		)
		return result
	},
}
