import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { AuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { commentsRepository } from '../repositories/commentRepository'
import { commentService } from '../services/commentsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestParamsQuery<P, Q> = Request<P, {}, {}, Q>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

const loginValidation = body('login')
	.trim()
	.isLength({ min: 3, max: 10 })
	.withMessage('Login length should be from 3 to 10')
const passwordValidation = body('password')
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Password length should be from 6 to 20')
const emailValidation = body('email')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('URL length should be from 1 to 100')
	.isEmail()
	.withMessage('Invalid email')
const contentValidation = body('content')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('Content length should be from 1 to 100')

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
		}
	}
)

commentsRouter.delete(
	'/:id',
	AuthMiddleware,
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const comment = await commentsRepository.findComment(req.params.id)
		if (comment?.id !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const ResultOfDelete = await commentService.deleteComment(req.params.id)
		if (!ResultOfDelete) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
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
		if (comment?.id !== req.user!.id) {
			res.sendStatus(403)
			return
		}
		const resultOfUpdate = await commentService.updateComment(
			req.params.id,
			req.body
		)
		if (!resultOfUpdate) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
)
