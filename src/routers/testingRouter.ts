import { Request, Response, Router } from 'express'
import { client } from '../db'
import { ipRequest } from '../middleware/antiSpamMiddleware'
import { postType } from '../repositories/PostsRepository'
import { UserDbType } from '../repositories/UsersRepository'
import { TokenDBType } from '../repositories/blacklistRepository'
import { blogType } from '../repositories/blogsRepository'
import { commentDBType } from '../repositories/commentRepository'
import { refreshTokensMetaTypeDB } from '../repositories/refreshTokensMetaRepository'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
	let resultOfDeleteBlogs = await client
		.db('hm03')
		.collection<blogType>('blogs')
		.deleteMany({})

	let resultOfDeletePosts = await client
		.db('hm03')
		.collection<postType>('posts')
		.deleteMany({})

	let resultOfDeleteUsers = await client
		.db('hm03')
		.collection<UserDbType>('users')
		.deleteMany({})

	let resultOfDeleteComments = await client
		.db('hm03')
		.collection<commentDBType>('comments')
		.deleteMany({})
	let resultOfDeleteBlacklistTokens = await client
		.db('hm03')
		.collection<TokenDBType>('BlacklistTokens')
		.deleteMany({})
	let resultOfDeleteIpRequests = await client
		.db('hm03')
		.collection<ipRequest>('ipRequests')
		.deleteMany({})
	let resultOfDeleteRefreshTokenMeta = await client
		.db('hm03')
		.collection<refreshTokensMetaTypeDB>('refreshTokensMeta')
		.deleteMany({})

	res.sendStatus(204)
	return
})
