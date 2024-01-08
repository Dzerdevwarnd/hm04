import { Request, Response, Router } from 'express'
import { postModel } from '../repositories/PostsRepository'
import { userModel } from '../repositories/UsersRepository'
import { BlacklistTokensModel } from '../repositories/blacklistTokensRepository'
import { blogModel } from '../repositories/blogsRepository'
import { commentModel } from '../repositories/commentRepository'
import { ipRequestModel } from '../repositories/ipRequestsRepository'
import { refreshTokensMetaModel } from '../repositories/refreshTokensMetaRepository'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
	let resultOfDeleteBlogs = await blogModel.deleteMany({})

	let resultOfDeletePosts = await postModel.deleteMany({})

	let resultOfDeleteUsers = await userModel.deleteMany({})

	let resultOfDeleteComments = await commentModel.deleteMany({})
	let resultOfDeleteBlacklistTokens = await BlacklistTokensModel.deleteMany({})
	let resultOfDeleteIpRequests = await ipRequestModel.deleteMany({})
	let resultOfDeleteRefreshTokenMeta = await refreshTokensMetaModel.deleteMany(
		{}
	)

	res.sendStatus(204)
	return
})
