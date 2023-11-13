import { jwtService } from '../application/jwt-service'
import { usersRepository } from '../repositories/UsersRepository'
import {
	commentType,
	commentsPaginationType,
} from '../repositories/commentRepository'

import { commentsRepository } from '../repositories/commentRepository'

export const commentService = {
	async findComment(id: string): Promise<commentType | null> {
		let comment = await commentsRepository.findComment(id)
		return comment
	},
	async findCommentsByPostId(
		id: string,
		query: any
	): Promise<commentsPaginationType | null> {
		let commentsPagination = await commentsRepository.findCommentsByPostId(
			id,
			query
		)
		return commentsPagination
	},
	async deleteComment(commentId: string): Promise<boolean> {
		let result = await commentsRepository.deleteComment(commentId)
		return result
	},
	async updateComment(id: string, body: { content: string }): Promise<boolean> {
		let result = await commentsRepository.updateComment(id, body)
		return result
	},
	async createCommentsByPostId(
		id: string,
		body: { content: string },
		token: string
	): Promise<commentType | null> {
		const userId: string = await jwtService.getUserIdByToken(token)
		console.log(userId)
		const user = await usersRepository.findUser(userId)
		if (!user) {
			return user
		}
		const comment: commentType = {
			id: String(Date.now()),
			content: body.content,
			commentatorInfo: {
				userId: user?.id,
				userLogin: user?.login,
			},
			createdAt: new Date(),
		}
		const newCommentWithout_id = await commentsRepository.createComment(comment)
		return newCommentWithout_id
	},
}
