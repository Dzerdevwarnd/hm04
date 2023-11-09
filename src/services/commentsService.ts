import { commentType } from '../repositories/commentRepository'

import { commentsRepository } from '../repositories/commentRepository'

export const commentService = {
	async findComment(id: string): Promise<commentType | null> {
		let comment = await commentsRepository.findComment(id)
		return comment
	},
	async deleteComment(commentId: string): Promise<boolean> {
		let result = await commentsRepository.deleteComment(commentId)
		return result
	},
	async updateComment(id: string, body: { context: string }): Promise<boolean> {
		let result = await commentService.updateComment(id, body)
		return result
	},
}
