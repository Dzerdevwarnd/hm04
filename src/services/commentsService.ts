import { ObjectId } from 'mongodb'
import { jwtService } from '../application/jwt-service'
import { usersRepository } from '../repositories/UsersRepository'
import {
	CommentDBType,
	CommentViewType,
	CommentsPaginationType,
	commentModel,
} from '../repositories/commentRepository'

import { commentsRepository } from '../repositories/commentRepository'
import { likesService } from './likesService'

export const commentService = {
	async findComment(
		commentId: string,
		userId: string
	): Promise<CommentViewType | null> {
		const like = await likesService.findCommentLikeFromUser(userId, commentId)
		const userLikeStatus = like?.likeStatus || 'None'
		let comment = await commentsRepository.findComment(
			commentId,
			userLikeStatus
		)
		return comment
	},
	async findCommentsByPostId(
		postId: string,
		query: any,
		userId: string
	): Promise<CommentsPaginationType | null> {
		let commentsDB =
			await commentsRepository.findDBCommentsByPostIdWithoutLikeStatus(
				postId,
				query
			)
		if (!commentsDB) {
			return null
		}
		const commentsView: CommentViewType[] = []
		for (const comment of commentsDB) {
			let like = await likesService.findCommentLikeFromUser(userId, comment.id)
			let commentView = {
				id: comment.id,
				content: comment.content,
				commentatorInfo: {
					userId: comment.commentatorInfo.userId,
					userLogin: comment.commentatorInfo.userLogin,
				},
				createdAt: comment.createdAt,
				likesInfo: {
					likesCount: comment.likesInfo.likesCount,
					dislikesCount: comment.likesInfo.dislikesCount,
					myStatus: like?.likeStatus || 'None',
				},
			}
			commentsView.push(commentView)
		}
		const totalCount = await commentModel.countDocuments({ postId: postId })
		const pagesCount = Math.ceil(totalCount / Number(query?.pageSize) || 10)
		const commentsPagination: CommentsPaginationType =
			new CommentsPaginationType(
				pagesCount,
				Number(query?.pageNumber) || 1,
				Number(query?.pageSize) || 10,
				totalCount,
				commentsView
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
		commentId: string,
		body: { likeStatus: string },
		accessToken: string
	): Promise<boolean> {
		const userId = await jwtService.verifyAndGetUserIdByToken(accessToken)
		const comment = await commentService.findComment(commentId, userId)
		let likesCount = comment!.likesInfo.likesCount
		let dislikesCount = comment!.likesInfo.dislikesCount
		if (body.likeStatus === 'Like' && comment?.likesInfo.myStatus !== 'Like') {
			likesCount = (+likesCount + 1).toString()
			commentsRepository.updateCommentLikesAndDislikesCount(
				commentId,
				likesCount.toString(),
				dislikesCount.toString()
			)
		} else if (
			body.likeStatus === 'Dislike' &&
			comment?.likesInfo.myStatus !== 'DisLike'
		) {
			dislikesCount = (+dislikesCount + 1).toString()
			commentsRepository.updateCommentLikesAndDislikesCount(
				commentId,
				likesCount.toString(),
				dislikesCount.toString()
			)
		}
		let like = await likesService.findCommentLikeFromUser(userId, commentId)
		if (!like) {
			await likesService.addLikeToBdFromUser(userId, commentId, body.likeStatus)
			return true
		} else {
			if (like.likeStatus === body.likeStatus) {
				return false
			}
			likesService.updateUserLikeStatus(userId, commentId, body.likeStatus)
			return true
		}
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
		const commentView = await commentsRepository.createComment(comment, userId)
		return commentView
	},
}
