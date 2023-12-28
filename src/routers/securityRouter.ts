import { Response, Router } from 'express'
import { refreshTokensMetaRepository } from '../repositories/refreshTokensMetaRepository'
import {
	RequestWithCookies,
	RequestWithParamsAndCookies,
} from '../types/RequestsTypes'

export const securityRouter = Router({})

securityRouter.get(
	'/devices',
	async (req: RequestWithCookies<{ refreshToken: string }>, res: Response) => {
		const devices = await refreshTokensMetaRepository.returnAllUserDevices(
			req.cookies.refreshToken
		)
		if (!devices) {
			res.sendStatus(401)
			return
		}
		res.status(200).send(devices)
		return
	},
	securityRouter.delete(
		'/devices',
		async (
			req: RequestWithCookies<{ refreshToken: string }>,
			res: Response
		) => {
			const isDeleted = await refreshTokensMetaRepository.deleteAllUserDevices(
				req.cookies.refreshToken
			)
			if (!isDeleted) {
				res.sendStatus(401)
				return
			}
			res.sendStatus(204)
			return
		}
	),
	securityRouter.delete(
		'/devices/:id',
		async (
			req: RequestWithParamsAndCookies<
				{ id: string },
				{ refreshToken: string }
			>,
			res: Response
		) => {
			const StatusCode =
				await refreshTokensMetaRepository.deleteOneUserDeviceAndReturnStatusCode(
					req.params.id,
					req.cookies.refreshToken
				)
			res.sendStatus(StatusCode)
			return
		}
	)
)
