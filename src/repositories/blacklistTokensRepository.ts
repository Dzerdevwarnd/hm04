import mongoose from 'mongoose'
import { settings } from '../setting'

export type TokenDBType = { token: string; expireDate: Date }

const BlacklistTokensSchema = new mongoose.Schema({
	token: { type: String, required: true },
	expireDate: { type: Date, required: true },
})

export const BlacklistTokensModel = mongoose.model(
	'BlacklistTokens',
	BlacklistTokensSchema
)

export const blacklistRepository = {
	async addTokensInBlacklist(
		reqBody: { accessToken: string },
		reqCookies: { refreshToken: string }
	): Promise<boolean> {
		const accessTokenDB = {
			token: reqBody.accessToken,
			expireDate: new Date( //@ts-ignore
				Date.now() + parseInt(settings.accessTokenLifeTime.match(/\d+/))
			),
		}
		const refreshTokenDB = {
			token: reqCookies.refreshToken,
			expireDate: new Date( //@ts-ignore
				Date.now() + parseInt(settings.refreshTokenLifeTime.match(/\d+/))
			),
		}

		const result = await BlacklistTokensModel.insertMany([
			accessTokenDB,
			refreshTokenDB,
		])

		setTimeout(
			() => BlacklistTokensModel.deleteOne({ token: accessTokenDB.token }),
			parseInt(settings.accessTokenLifeTime)
		)

		setTimeout(
			() => BlacklistTokensModel.deleteOne({ token: refreshTokenDB.token }),
			parseInt(settings.refreshTokenLifeTime)
		)
		return result.length == 2
	},

	async addRefreshTokenInBlacklist(cookies: {
		refreshToken: string
	}): Promise<boolean> {
		const refreshTokenDB = {
			token: cookies.refreshToken,
			expireDate: new Date( //@ts-ignore
				Date.now() + parseInt(settings.refreshTokenLifeTime.match(/\d+/))
			),
		}

		const result = await BlacklistTokensModel.insertMany(refreshTokenDB)

		setTimeout(
			() => BlacklistTokensModel.deleteOne({ token: refreshTokenDB.token }),
			parseInt(settings.refreshTokenLifeTime)
		)
		return result.length == 1
	},
}
