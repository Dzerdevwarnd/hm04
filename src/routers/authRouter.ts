import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { emailAdapter } from '../adapters/emailAdapter'
import { jwtService } from '../application/jwt-service'
import { client } from '../db'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { UserDbType, usersRepository } from '../repositories/UsersRepository'
import {
	TokenDBType,
	blacklistRepository,
} from '../repositories/blacklistRepository'
import { authService } from '../services/authService'
import { userService } from '../services/usersService'
import { RequestWithBody, RequestWithCookies } from '../types/RequestsTypes'

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
	if (new Date() > user.emailConfirmationData.confirmationCode) {
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

const EmailIsAlreadyConfirmedValidation = body('email').custom(
	async (email: string) => {
		const user = await usersRepository.findDBUser(email)
		if (user?.emailConfirmationData.isConfirmed === true) {
			throw new Error('Email is already confirmed')
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
	if (!req.headers.authorization) {
		res.sendStatus(401)
		return
	}
	const token = req.headers.authorization!.split(' ')[1]
	const userId = await jwtService.verifyAndGetUserIdByToken(token)
	if (!userId) {
		res.sendStatus(401)
		return
	}
	const user = await userService.findUser(userId)
	const userInfo = {
		userId: userId,
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
	async (
		req: RequestWithBody<{ loginOrEmail: string; password: string }>,
		res: Response
	) => {
		const tokens = await authService.loginAndReturnJwtKeys(
			req.body.loginOrEmail,
			req.body.password
		)
		if (!tokens?.accessToken) {
			res.sendStatus(401)
			return
		} else {
			res
				.cookie('refreshToken', tokens.refreshToken, {
					httpOnly: true,
					secure: true,
				})
				.status(200)
				.send({ accessToken: tokens.accessToken })
			return
		}
	}
)

authRouter.post(
	'/refresh-token',
	async (req: RequestWithCookies<{ refreshToken: string }>, res: Response) => {
		const tokenInBlackList = await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.findOne({ token: req.cookies.refreshToken })
		if (tokenInBlackList) {
			res.sendStatus(401)
			return
		}
		const userId: string = await jwtService.verifyAndGetUserIdByToken(
			req.cookies.refreshToken
		)
		const user: UserDbType | null = await usersRepository.findUser(userId)
		if (!user) {
			res.sendStatus(401)
			return
		}
		const tokens = await authService.refreshTokens(user!)
		if (!tokens?.accessToken || !tokens.refreshToken) {
			res.sendStatus(401) //
			return
		}
		const isAdded = await blacklistRepository.addRefreshTokenInBlacklist(
			req.cookies
		)
		if (!isAdded) {
			res.status(555).send('BlacklistError')
			return
		}
		res
			.cookie('refreshToken', tokens.refreshToken, {
				httpOnly: true,
				secure: true,
			})
			.status(200)
			.send({ accessToken: tokens.accessToken })
		return
	}
)

authRouter.post(
	'/logout',
	async (
		req: RequestWithCookies<{ cookies: { refreshToken: string } }>,
		res: Response
	) => {
		const tokenInBlackList = await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.findOne({ token: req.cookies.refreshToken })
		if (tokenInBlackList) {
			res.sendStatus(401)
			return
		}
		const userId = await jwtService.verifyAndGetUserIdByToken(
			req.cookies.refreshToken
		)
		if (!userId) {
			res.sendStatus(401)
			return
		}
		const isAdded = await blacklistRepository.addRefreshTokenInBlacklist({
			refreshToken: req.cookies.refreshToken,
		})
		if (!isAdded) {
			res.sendStatus(555)
			return
		} else {
			res.sendStatus(204)
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
	async (
		req: RequestWithBody<{ password: string; email: string; login: string }>,
		res: Response
	) => {
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
	inputValidationMiddleware,
	async (req: RequestWithBody<{ code: string }>, res: Response) => {
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
	EmailIsAlreadyConfirmedValidation,
	inputValidationMiddleware,
	async (req: RequestWithBody<{ email: string }>, res: Response) => {
		await usersRepository.userConfirmationCodeUpdate(req.body.email)
		await emailAdapter.sendConfirmEmail(req.body.email)
		res.sendStatus(204)
		return
	}
)
///////
