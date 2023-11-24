import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { emailAdapter } from '../adapters/emailAdapter'
import { jwtService } from '../application/jwt-service'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { usersRepository } from '../repositories/UsersRepository'
import { authService } from '../services/authService'
import { userService } from '../services/usersService'

export const authRouter = Router({})

const loginValidation = body('login')
	.trim()
	.isLength({ min: 3, max: 10 })
	.withMessage('login length should be from 3 to 10')
	.custom(async (login: string) => {
		const user = await usersRepository.findDBUser(login)
		if (user) {
			throw new Error('User with that login is already exist')
		}
	})

const EmailFormValidation = body('email')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('Email length should be from 1 to 100')
	.isEmail()
	.withMessage('Incorrect email')

const EmailUsageValidation = body('email').custom(async (email: string) => {
	const user = await usersRepository.findDBUser(email)
	if (user) {
		throw new Error('User with that email is already exist')
	}
})

const loginOrEmailValidation = body('loginOrEmail')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('login or Email length should be from 1 to 100')

const passwordValidation = body('password')
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Password or Email length should be from 6 to 20')

const confirmationCodeValidation = body('code').custom(async (code: string) => {
	const user = await userService.findDBUserByConfirmationCode(code)
	if (!user) {
		throw new Error('Invalid Code')
	}
})

const confirmationCodeIsAlreadyConfirmedValidation = body('code').custom(
	async (code: string) => {
		const user = await userService.findDBUserByConfirmationCode(code)
		if (user?.emailConfirmationData.isConfirmed === true) {
			throw new Error('Code is already confirmed')
		}
	}
)

const emailExistValidation = body('email').custom(async (email: string) => {
	const user = await usersRepository.findDBUser(email)
	if (!user) {
		throw new Error('User with this email not exist')
	}
})

authRouter.get('/me', async (req: Request, res: Response) => {
	const token = req.headers.authorization!.split(' ')[1]
	const userId = await jwtService.getUserIdByToken(token)
	if (!userId) {
		res.sendStatus(401)
		return
	}
	const user = await userService.findUser(userId)
	const userInfo = {
		id: userId,
		login: user!.accountData.login,
		email: user!.accountData.email,
	}
	res.status(200).send(userInfo)
	return
})

authRouter.post(
	'/login',
	loginOrEmailValidation,
	passwordValidation,
	inputValidationMiddleware,
	async (req: Request, res: Response) => {
		const accessToken = await authService.loginAndReturnJwtKey(
			req.body.loginOrEmail,
			req.body.password
		)
		if (!accessToken) {
			res.sendStatus(401)
			return
		} else {
			res.status(200).send(accessToken)
			return
		}
	}
)

authRouter.post(
	'/registration',
	EmailFormValidation,
	EmailUsageValidation,
	loginValidation,
	passwordValidation,
	inputValidationMiddleware,
	async (req: Request, res: Response) => {
		const newUser = await authService.createUser(
			req.body.password,
			req.body.email,
			req.body.login
		)
		if (!newUser) {
			res.status(400).send('User create error')
			return
		}
		await emailAdapter.sendConfirmEmail(req.body.email)
		res.sendStatus(204)
		return
	}
)

authRouter.post(
	'/registration-confirmation',
	confirmationCodeIsAlreadyConfirmedValidation,
	confirmationCodeValidation,
	async (req: Request, res: Response) => {
		const isConfirmationAccept = await userService.userEmailConfirmationAccept(
			req.body.code
		)
		if (!isConfirmationAccept) {
			res.status(400).send('user confirm error')
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
)

authRouter.post(
	'/registration-email-resending',
	EmailFormValidation,
	emailExistValidation,
	confirmationCodeIsAlreadyConfirmedValidation,
	inputValidationMiddleware,
	async (req: Request, res: Response) => {
		usersRepository.userConfirmationCodeUpdate(req.body.email)
		emailAdapter.sendConfirmEmail(req.body.email)
		res.sendStatus(204)
		return
	}
)
/////
