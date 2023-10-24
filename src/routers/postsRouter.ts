import { Request, Response, Router } from 'express'
import { body, param } from 'express-validator'
import { basicAuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import { postsByBlogIdPaginationType } from '../repositories/PostsRepository'
import { blogsService } from '../services/blogsService'
import { postsService } from '../services/postsService'
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

type blogType = {
	id: string
	name: string
	description: string
	websiteUrl: string
}

export const postsRouter = Router({})

export const postsValidation = {
	titleValidation: body('title')
		.trim()
		.isLength({ min: 1, max: 30 })
		.withMessage('title length should be from 1 to 30'),
	shortDescriptionValidation: body('shortDescription')
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage('shortDescription length should be from 1 to 100'),
	contentValidation: body('content')
		.trim()
		.isLength({ min: 1, max: 1000 })
		.withMessage('Content length should be from 1 to 1000'),
	blogIdValidation: body('blogId')
		.isString()
		.trim()
		.isLength({ min: 1, max: 100 })
		.withMessage('blogId length should be from 1 to 100'),

	blogIdExistValidationFromBody: body('blogId').custom(
		async (value: string, { req }) => {
			const id = value
			const params = { id }
			const blog: blogType | undefined = await blogsService.findBlog(params)
			if (!blog) {
				throw new Error('Blog id does not exist')
			}
		}
	),
	blogIdExistValidationFromUrl: param('id').custom(
		async (value: string, { req }) => {
			const id = value
			const params = { id }
			const blog: blogType | undefined = await blogsService.findBlog(params)
			if (!blog) {
				Response.sendStatus(404)
				const error = new Error('Blog id does not exist')
				throw error
			}
		}
	),
}
postsRouter.get(
	'/',
	async (req: RequestWithQuery<{ query: any }>, res: Response) => {
		const allPosts: postsByBlogIdPaginationType =
			await postsService.returnAllPosts(req.query)
		res.status(200).send(allPosts)
	}
)

postsRouter.get(
	'/:id',
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const foundPost = await postsService.findPost(req.params)
		if (!foundPost) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundPost)
		}
	}
)

postsRouter.post(
	'/',
	basicAuthMiddleware,
	postsValidation.blogIdExistValidationFromBody,
	postsValidation.titleValidation,
	postsValidation.shortDescriptionValidation,
	postsValidation.contentValidation,
	postsValidation.blogIdValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithBody<{
			title: string
			shortDescription: string
			content: string
			blogId: string
		}>,
		res: Response
	) => {
		const newPost = await postsService.createPost(req.body)
		res.status(201).send(newPost)
	}
)

postsRouter.put(
	'/:id',
	basicAuthMiddleware,
	postsValidation.blogIdExistValidationFromBody,
	postsValidation.titleValidation,
	postsValidation.shortDescriptionValidation,
	postsValidation.contentValidation,
	postsValidation.blogIdValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<
			{ id: string },
			{
				title: string
				shortDescription: string
				content: string
				blogId: string
			}
		>,
		res: Response
	) => {
		const ResultOfUpdatePost = await postsService.updatePost(
			req.params.id,
			req.body
		)
		if (!ResultOfUpdatePost) {
			res.sendStatus(404)
		} else {
			res.sendStatus(204)
		}
	}
)

postsRouter.delete(
	'/:id',
	basicAuthMiddleware,
	async (req: RequestWithParams<{ id: string }>, res: Response) => {
		const resultOfDelete = await postsService.deletePost(req.params)
		if (!resultOfDelete) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
)
