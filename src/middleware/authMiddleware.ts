import { NextFunction, Request, Response } from 'express'
import expressBasicAuth from 'express-basic-auth'
import { jwtService } from '../application/jwt-service'
import { userService } from '../services/usersService'

export const AuthMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.headers.authorization) {
		res.sendStatus(401)
		return
	}
	const token = req.headers.authorization.split(' ')[1]
	const userId = await jwtService.verifyAndGetUserIdByToken(token)
	if (userId) {
		req.user = await userService.findUser(userId)
		next()
	} else {
		res.send(401)
	}
}

export const basicAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	expressBasicAuth({
		users: { admin: 'qwerty' },
		unauthorizedResponse: 'Unauthorized',
	})(req, res, next)
}
