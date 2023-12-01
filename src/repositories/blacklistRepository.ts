import { client } from '../db'
import { settings } from '../setting'

export type TokenDBType = { token: string; expireDate: Date }

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

		await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 })

		const result = await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.insertMany([accessTokenDB, refreshTokenDB])
		return result.insertedCount === 2
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
		await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 })
		const result = await client
			.db('hm03')
			.collection<TokenDBType>('BlacklistTokens')
			.insertOne(refreshTokenDB)
		return result.acknowledged
	},
}
