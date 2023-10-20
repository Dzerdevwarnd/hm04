import { Request, Response, Router } from 'express'
import { client } from '../db'
import { postType } from '../repositories/PostsRepository'
import { blogType } from '../repositories/blogsRepository'

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
	let resultBlogs = await client
		.db('hm03')
		.collection<blogType>('blogs')
		.deleteMany({})

	let resultPosts = await client
		.db('hm03')
		.collection<postType>('posts')
		.deleteMany({})

	res.sendStatus(204)
	return
})
