import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { userService } from '../services/usersService'

export const authRouter = Router({})

const loginOrEmailValidation = body('loginOrEmail')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('login or Email length should be from 1 to 100')

const passwordValidation = body('password')
	.trim()
	.isLength({ min: 1, max: 20 })
	.withMessage('Password or Email length should be from 1 to 20')

authRouter.post(
	'/login',
	loginOrEmailValidation,
	passwordValidation,
	inputValidationMiddleware,
	async (req: Request, res: Response) => {
		const checkResult = await userService.checkCreditionals(
			req.body.loginOrEmail,
			req.body.password
		)
		if (checkResult === false) {
			res.sendStatus(401)
		} else {
			res.sendStatus(204)
		}
	}
)
