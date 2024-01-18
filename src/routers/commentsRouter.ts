import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { AuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { commentsRepository } from '../repositories/commentRepository'
import { commentService } from '../services/commentsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>

const contentValidation = body('content')
	.trim()
	.isLength({ min: 20, max: 300 })
	.withMessage('Content length should be from 20 to 300')

const likeStatusValidation = body('LikeStatus')
	.trim()
	.custom(async (likeStatus: string) => {
		const allowedValues = ['None', 'Like', 'Dislike ']
		if (!allowedValues.includes(likeStatus)) {
			throw new Error('Incorrect likeStatus Value')
		}
	})

export const commentsRouter = Router({})

commentsRouter.get(
	'/:id',
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const foundComment = await commentService.findComment(req.params.id)
		if (!foundComment) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundComment)
			return
		}
	}
)

commentsRouter.delete(
	'/:id',
	AuthMiddleware,
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const comment = await commentsRepository.findComment(req.params.id)
		if (!comment) {
			res.sendStatus(404)
			return
		}
		if (comment.commentatorInfo.userId !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const ResultOfDelete = await commentService.deleteComment(req.params.id)
		res.sendStatus(204)
		return
	}
)

commentsRouter.put(
	'/:id',
	AuthMiddleware,
	contentValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<{ id: string }, { content: string }>,
		res: Response
	) => {
		const comment = await commentsRepository.findComment(req.params.id)
		if (!comment) {
			res.sendStatus(404)
			return
		}
		if (comment.commentatorInfo.userId !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const resultOfUpdate = await commentService.updateComment(
			req.params.id,
			req.body
		)
		res.sendStatus(204)
		return
	}
)

commentsRouter.put(
	'/:id/like-status',
	AuthMiddleware,
	likeStatusValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<{ id: string }, { likeStatus: string }>,
		res: Response
	) => {
		const comment = await commentsRepository.findComment(req.params.id)
		if (!comment) {
			res.sendStatus(404)
			return
		}

		const resultOfUpdate = await commentService.updateCommentLikeStatus(
			req.params.id,
			req.body
		)
		res.sendStatus(204)
		return
	}
)
