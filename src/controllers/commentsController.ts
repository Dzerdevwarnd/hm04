import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { jwtService } from '../application/jwt-service'
import { CommentsService } from '../services/commentsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>

@injectable()
export class CommentsController {
	constructor(protected commentsService: CommentsService) {}
	async getComment(req: RequestWithParams<{ id: string }>, res: Response) {
		let userId = undefined
		if (req.headers.authorization) {
			userId = await jwtService.verifyAndGetUserIdByToken(
				req.headers.authorization.split(' ')[1]
			)
		}
		const foundComment = await this.commentsService.findComment(
			req.params.id,
			userId
		)
		if (!foundComment) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundComment)
			return
		}
	}
	async deleteComment(req: RequestWithParams<{ id: string }>, res: Response) {
		const comment = await this.commentsService.findComment(
			req.params.id,
			req.headers.authorization!.split(' ')[1]
		)
		if (!comment) {
			res.sendStatus(404)
			return
		}
		if (comment.commentatorInfo.userId !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const ResultOfDelete = await this.commentsService.deleteComment(
			req.params.id
		)
		res.sendStatus(204)
		return
	}
	async updateCommentContent(
		req: RequestWithParamsAndBody<{ id: string }, { content: string }>,
		res: Response
	) {
		const comment = await this.commentsService.findComment(
			req.params.id,
			req.headers.authorization!.split(' ')[1]
		)
		if (!comment) {
			res.sendStatus(404)
			return
		}
		if (comment.commentatorInfo.userId !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const resultOfUpdate = await this.commentsService.updateComment(
			req.params.id,
			req.body
		)
		res.sendStatus(204)
		return
	}

	async updateCommentLikeStatus(
		req: RequestWithParamsAndBody<{ id: string }, { likeStatus: string }>,
		res: Response
	) {
		const comment = await this.commentsService.findComment(
			req.params.id,
			req.headers.authorization!.split(' ')[1]
		)
		if (!comment) {
			res.sendStatus(404)
			return
		}

		const resultOfUpdate = await this.commentsService.updateCommentLikeStatus(
			req.params.id,
			req.body,
			req.headers.authorization!.split(' ')[1]
		)
		res.sendStatus(204)
		return
	}
}
