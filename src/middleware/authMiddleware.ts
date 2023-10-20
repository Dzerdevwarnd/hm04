import { NextFunction, Request, Response } from 'express'
import basicAuth from 'express-basic-auth'

export const basicAuthMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	basicAuth({
		users: { admin: 'qwerty' },
		unauthorizedResponse: 'Unauthorized',
	})(req, res, next)
}
