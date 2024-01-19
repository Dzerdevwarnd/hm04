import { ObjectId } from 'mongodb'
import { jwtService } from '../application/jwt-service'
import { usersRepository } from '../repositories/UsersRepository'
import {
	CommentDBType,
	CommentViewType,
	CommentsPaginationType,
} from '../repositories/commentRepository'

import { commentsRepository } from '../repositories/commentRepository'

export const commentService = {
	async findComment(id: string,accessToken:string): Promise<CommentViewType | null> {
		const userId = await jwtService.verifyAndGetUserIdByToken(accessToken)
		let comment = await commentsRepository.findComment(id,userId)
		return comment
	},
	async findCommentsByPostId(
		id: string,
		query: any,
	): Promise<CommentsPaginationType | null> {
		let commentsPagination = await commentsRepository.findCommentsByPostId(
			id,
			query,
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
		body: { likeStatus: string },
		accessToken:string
	): Promise<boolean> {
		const userId = await jwtService.verifyAndGetUserIdByToken(accessToken)
		let result = await commentsRepository.updateCommentLikeStatus(id, body,userId)
		return result
	},
	async createCommentsByPostId(
		id: string,
		body: { content: string },
		token: string
	): Promise<CommentViewType | null> {
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
		const commentView = await commentsRepository.createComment(comment,userId)
		return commentView
	},
}
