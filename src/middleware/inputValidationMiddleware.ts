import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const inputValidationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req).array({ onlyFirstError: true })
	if (errors.length > 0) {
		let errorsMessages = []
		for (let i = 0; i < errors.length; i++) {
			let errorResponse = { message: '', field: '' }
			errorResponse.message = errors[i].msg
			//@ts-ignore
			errorResponse.field = errors[i].path
			errorsMessages.push(errorResponse)
		}
		res.status(400).json({ errorsMessages })
	} else {
		next()
	}
}
