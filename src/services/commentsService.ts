import { ObjectId } from 'mongodb'
import { jwtService } from '../application/jwt-service'
import { usersRepository } from '../repositories/UsersRepository'
import {
	CommentDBType,
	CommentType,
	CommentsPaginationType,
} from '../repositories/commentRepository'

import { commentsRepository } from '../repositories/commentRepository'

export const commentService = {
	async findComment(id: string): Promise<CommentType | null> {
		let comment = await commentsRepository.findComment(id)
		return comment
	},
	async findCommentsByPostId(
		id: string,
		query: any
	): Promise<CommentsPaginationType | null> {
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
	async updateCommentLikeStatus(
		id: string,
		body: { likeStatus: string }
	): Promise<boolean> {
		let result = await commentsRepository.updateCommentLikeStatus(id, body)
		return result
	},
	async createCommentsByPostId(
		id: string,
		body: { content: string },
		token: string
	): Promise<CommentType | null> {
		const userId = await jwtService.verifyAndGetUserIdByToken(token)
		const user = await usersRepository.findUser(userId!)
		if (!user) {
			return user
		}
		const comment: CommentDBType = new CommentDBType(
			new ObjectId(),
			String(Date.now()),
			id,
			body.content,
			{ userId: user.id, userLogin: user.accountData.login },
			new Date()
		)
		const newCommentWithout_id = await commentsRepository.createComment(comment)
		return newCommentWithout_id
	},
}
