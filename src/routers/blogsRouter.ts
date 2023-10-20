import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { basicAuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { blogsPaginationType } from '../repositories/blogsRepository'
import { blogsService } from '../services/blogsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>

const nameValidation = body('name')
	.trim()
	.isLength({ min: 1, max: 15 })
	.withMessage('Name length should be from 1 to 15')
const descriptionValidation = body('description')
	.trim()
	.isLength({ min: 1, max: 500 })
	.withMessage('Description length should be from 1 to 500')
const urlValidation = body('websiteUrl')
	.trim()
	.isLength({ min: 1, max: 100 })
	.withMessage('URL length should be from 1 to 101')
	.isURL()
	.withMessage('Invalid URl')

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
	const blogsPagination: blogsPaginationType =
		await blogsService.returnAllBlogs()
	res.status(200).send(blogsPagination)
})

blogsRouter.get(
	'/:id',
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const foundBlog = await blogsService.findBlog(req.params)
		if (!foundBlog) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundBlog)
			return
		}
	}
)

blogsRouter.get(
	'/:id/posts',
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const foundPosts = await blogsService.findPostsByBlogId(req.params)
		if (!foundPosts) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundPosts)
			return
		}
	}
)

blogsRouter.post(
	'/',
	basicAuthMiddleware,
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithBody<{
			name: string
			description: string
			websiteUrl: string
		}>,
		res: Response
	) => {
		const newBlog = await blogsService.createBlog(req.body)
		res.status(201).send(newBlog)
	}
)

blogsRouter.put(
	'/:id',
	basicAuthMiddleware,
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<
			{ id: string },
			{
				name: string
				description: string
				websiteUrl: string
			}
		>,
		res: Response
	) => {
		const resultOfUpdateBlog = await blogsService.updateBlog(
			req.params.id,
			req.body
		)
		if (!resultOfUpdateBlog) {
			res.sendStatus(404)
		} else {
			res.sendStatus(204)
		}
	}
)

blogsRouter.delete(
	'/:id',
	basicAuthMiddleware,
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const ResultOfDeleteBlog = await blogsService.deleteBlog(req.params)
		if (!ResultOfDeleteBlog) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
)
