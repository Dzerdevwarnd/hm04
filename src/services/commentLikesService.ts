import {
	commentLikeDBType,
	commentLikesRepository,
} from '../repositories/commentsLikesRepository'

export const commentsLikesService = {
	async findCommentLikeFromUser(userId: string, commentId: string) {
		const like = await commentLikesRepository.findCommentLikeFromUser(
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
		const like = new commentLikeDBType(userId, commentId, likeStatus)
		const result = await commentLikesRepository.addLikeToBdFromUser(like)
		return result
	},
	async updateUserLikeStatus(
		userId: string,
		commentId: string,
		likeStatus: string
	) {
		const result = commentLikesRepository.updateUserLikeStatus(
			userId,
			commentId,
			likeStatus
		)
		return result
	},
}
