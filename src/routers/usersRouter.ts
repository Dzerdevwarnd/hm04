import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { basicAuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { usersPaginationType } from '../repositories/UsersRepository'
import { userService } from '../services/usersService'

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

export const usersRouter = Router({})

usersRouter.get(
	'/',
	async (req: RequestWithQuery<{ query: any }>, res: Response) => {
		const usersPagination: usersPaginationType =
			await userService.returnAllUsers(req.query)
		res.status(200).send(usersPagination)
	}
)

usersRouter.post(
	'/',
	basicAuthMiddleware,
	loginValidation,
	passwordValidation,
	emailValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithBody<{
			login: string
			password: string
			email: string
		}>,
		res: Response
	) => {
		const newUser = await userService.createUser(req.body)
		res.status(201).send(newUser)
	}
)

usersRouter.delete(
	'/:id',
	basicAuthMiddleware,
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const ResultOfDelete = await userService.deleteUser(req.params)
		if (!ResultOfDelete) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
)
