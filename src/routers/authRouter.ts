import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { emailAdapter } from '../adapters/emailAdapter'
import { jwtService } from '../application/jwt-service'
import { antiSpamMiddleware } from '../middleware/antiSpamMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { UserDbType, usersRepository } from '../repositories/UsersRepository'
import {
	BlacklistTokensModel,
	blacklistRepository,
} from '../repositories/blacklistTokensRepository'
import {
	refreshTokensMetaRepository,
	refreshTokensMetaTypeDB,
} from '../repositories/refreshTokensMetaRepository'
import { authService } from '../services/authService'
import { userService } from '../services/usersService'
import { settings } from '../setting'
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
	.withMessage('Password length should be from 6 to 20')

const confirmationCodeValidation = body('code').custom(async (code: string) => {
	const user = await userService.findDBUserByConfirmationCode(code)
	if (!user) {
		throw new Error('Invalid Code')
	}
	if (new Date() > user.emailConfirmationData.expirationDate) {
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

const recoveryCodeValidation = body('recoveryCode').custom(
	async (recoveryCode: string) => {
		const resultOfVerify = await jwtService.verifyJwtToken(recoveryCode)
		if (!resultOfVerify) {
			throw new Error('Recovery code is incorrect')
		}
	}
)

const newPasswordValidation = body('newPassword')
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Password length should be from 6 to 20')

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
	antiSpamMiddleware,
	async (
		req: RequestWithBody<{ loginOrEmail: string; password: string }>,
		res: Response
	) => {
		const deviceId = String(Date.now())
		const tokens = await authService.loginAndReturnJwtKeys(
			req.body.loginOrEmail,
			req.body.password,
			deviceId
		)
		if (!tokens?.accessToken) {
			res.sendStatus(401)
			return
		} else {
			const user = await usersRepository.findDBUser(req.body.loginOrEmail)
			const ipAddress =
				req.ip ||
				req.headers['x-forwarded-for'] ||
				req.headers['x-real-ip'] ||
				req.socket.remoteAddress
			const RefreshTokenMeta: refreshTokensMetaTypeDB = {
				userId: user!.id,
				deviceId: deviceId,
				title: req.headers['user-agent'] || 'unknown',
				ip: ipAddress,
				lastActiveDate: new Date(),
				expiredAt: new Date(Date.now() + +settings.refreshTokenLifeTime), //
			}
			const isCreated = await refreshTokensMetaRepository.createRefreshToken(
				RefreshTokenMeta
			)
			if (!isCreated) {
				res.status(400).send('RefreshTokenMeta error')
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
	}
)

authRouter.post(
	'/refresh-token',
	antiSpamMiddleware,
	async (req: RequestWithCookies<{ refreshToken: string }>, res: Response) => {
		const tokenInBlackList = await BlacklistTokensModel.findOne({
			token: req.cookies.refreshToken,
		})
		if (tokenInBlackList) {
			res.sendStatus(401)
			return
		}
		const userId: string | undefined =
			await userService.getUserIdFromRefreshToken(req.cookies.refreshToken)
		if (!userId) {
			res.sendStatus(401)
			return
		}
		const user: UserDbType | null = await usersRepository.findUser(userId)
		if (!user) {
			res.sendStatus(401)
			return
		}
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(
			req.cookies.refreshToken
		)
		const tokens = await authService.refreshTokens(user!, deviceId)
		if (!tokens?.accessToken || !tokens.refreshToken) {
			res.sendStatus(401) ///
			return
		}
		const isAdded = await blacklistRepository.addRefreshTokenInBlacklist(
			req.cookies
		)
		if (!isAdded) {
			res.status(555).send('BlacklistError')
			return
		}
		const ipAddress =
			req.ip ||
			req.headers['x-forwarded-for'] ||
			req.headers['x-real-ip'] ||
			req.socket.remoteAddress
		const RefreshTokenMetaUpd = {
			lastActiveDate: new Date(),
			expiredAt: new Date(Date.now() + +settings.refreshTokenLifeTime),
		}
		const isUpdated = await refreshTokensMetaRepository.updateRefreshTokenMeta(
			deviceId,
			RefreshTokenMetaUpd
		)
		if (!isUpdated) {
			res.status(400).send('RefreshTokenMeta error')
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
	antiSpamMiddleware,
	async (
		req: RequestWithCookies<{ cookies: { refreshToken: string } }>,
		res: Response
	) => {
		const tokenInBlackList = await BlacklistTokensModel.findOne({
			token: req.cookies.refreshToken,
		})
		if (tokenInBlackList) {
			res.sendStatus(401)
			return
		}
		const userId = await userService.getUserIdFromRefreshToken(
			req.cookies.refreshToken
		)
		if (!userId) {
			res.sendStatus(401)
			return
		}
		const deviceId = await jwtService.verifyAndGetDeviceIdByToken(
			req.cookies.refreshToken
		)
		const isDeletedFromRefreshTokenMeta =
			await refreshTokensMetaRepository.deleteOneUserDeviceAndReturnStatusCode(
				deviceId,
				req.cookies.refreshToken
			)
		const isAddedToBlacklist =
			await blacklistRepository.addRefreshTokenInBlacklist({
				refreshToken: req.cookies.refreshToken,
			})
		if (!isAddedToBlacklist) {
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
	antiSpamMiddleware,
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
	antiSpamMiddleware,
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
	antiSpamMiddleware,
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

authRouter.post(
	'/password-recovery',
	antiSpamMiddleware,
	EmailFormValidation,
	inputValidationMiddleware,
	async (req: RequestWithBody<{ email: string }>, res: Response) => {
		const recoveryCode = await jwtService.createRecoveryCode(req.body.email)
		console.log(recoveryCode)
		await emailAdapter.sendRecoveryCode(req.body.email, recoveryCode)
		const result = await userService.updateRecoveryCode(
			req.body.email,
			recoveryCode
		)
		//Ошибка на случай неудачного поиска и обновления данных пользователя
		/*if (!result) {
			res.sendStatus(999)
			return
		}*/
		res.sendStatus(204)
		return
	}
)

authRouter.post(
	'/new-password',
	antiSpamMiddleware,
	newPasswordValidation,
	recoveryCodeValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithBody<{ newPassword: string; recoveryCode: string }>,
		res: Response
	) => {
		const resultOfUpdate = await userService.updateUserPassword(
			req.body.recoveryCode,
			req.body.newPassword
		)
		//Ошибка на случай неудачного поиска и/или обновления данных пользователя
		/*if (!resultOfUpdate) {
			res.sendStatus(999)
			return
		}*/
		res.sendStatus(204)
		return
	}
)
///////
