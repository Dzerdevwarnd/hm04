import {
	postLikeDBType,
	postLikesRepository,
} from '../repositories/postLikesRepository'

export const postLikesService = {
	async findPostLikeFromUser(userId: string, postId: string) {
		const like = await postLikesRepository.findPostLikeFromUser(userId, postId)
		return like
	},
	async findLast3Likes(postId: string) {
		const last3Likes = await postLikesRepository.findLast3Likes(postId)
		return last3Likes
	},

	async addLikeToBdFromUser(
		userId: string,
		postId: string,
		likeStatus: string,
		login?: string
	) {
		const like = new postLikeDBType(userId, postId, likeStatus, login)
		const result = await postLikesRepository.addLikeToBdFromUser(like)
		return result
	},
	async updateUserLikeStatus(
		userId: string,
		postId: string,
		likeStatus: string
	) {
		const result = postLikesRepository.updateUserLikeStatus(
			userId,
			postId,
			likeStatus
		)
		return result
	},
}
