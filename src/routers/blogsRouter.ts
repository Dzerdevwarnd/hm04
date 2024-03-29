import { Request, Router } from 'express'
import { body } from 'express-validator'
import { basicAuthMiddleware } from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'

import { appContainer } from '../compositionRoots/composition-root'
import { BlogsController } from '../controllers/BlogsController'
import { postsValidation } from './postsRouter'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestParamsQuery<P, Q> = Request<P, {}, {}, Q>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

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

const blogsControllerInstance = appContainer.resolve(BlogsController)

blogsRouter.get(
	'/',
	blogsControllerInstance.getBlogsWithPagination.bind(blogsControllerInstance)
)

blogsRouter.get(
	'/:id',
	blogsControllerInstance.getBlogById.bind(blogsControllerInstance)
)

blogsRouter.get(
	'/:id/posts',
	blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance)
)

blogsRouter.post(
	'/',
	basicAuthMiddleware,
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidationMiddleware,
	blogsControllerInstance.postBlog.bind(blogsControllerInstance)
)

blogsRouter.post(
	'/:id/posts',
	basicAuthMiddleware,
	//postsValidation.blogIdExistValidationFromUrl,
	postsValidation.titleValidation,
	postsValidation.shortDescriptionValidation,
	postsValidation.contentValidation,
	inputValidationMiddleware,
	blogsControllerInstance.createPostByBlogId.bind(blogsControllerInstance)
)

blogsRouter.get(
	'/:id/posts',
	basicAuthMiddleware,
	//postsValidation.blogIdExistValidationFromUrl,
	postsValidation.titleValidation,
	postsValidation.shortDescriptionValidation,
	postsValidation.contentValidation,
	inputValidationMiddleware,
	blogsControllerInstance.createPostByBlogId.bind(blogsControllerInstance)
)

blogsRouter.put(
	'/:id',
	basicAuthMiddleware,
	nameValidation,
	descriptionValidation,
	urlValidation,
	inputValidationMiddleware,
	blogsControllerInstance.updateBlog.bind(blogsControllerInstance)
)

blogsRouter.delete(
	'/:id',
	blogsControllerInstance.deleteBlogByID.bind(blogsControllerInstance)
)

/*
blogsRouter.get(
	'/',
	async (req: RequestWithQuery<{ query: any }>, res: Response) => {
		const blogsPagination: blogsPaginationType =
			await blogsService.returnAllBlogs(req.query)
		res.status(200).send(blogsPagination)
		return
	}
)

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
	async (
		req: RequestParamsQuery<{ id: string }, { query: any }>,
		res: Response
	) => {
		const foundPosts = await blogsService.findPostsByBlogId(
			req.params,
			req.query
		)
		if (foundPosts?.items.length === 0) {
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
		return
	}
)

blogsRouter.post(
	'/:id/posts',
	basicAuthMiddleware,
	//postsValidation.blogIdExistValidationFromUrl,
	postsValidation.titleValidation,
	postsValidation.shortDescriptionValidation,
	postsValidation.contentValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<
			{ id: string },
			{
				title: string
				shortDescription: string
				content: string
			}
		>,
		res: Response
	) => {
		if ((await blogsService.findBlog(req.params)) === undefined) {
			res.sendStatus(404)
			return
		}
		const newPost = await postsService.createPostByBlogId(
			req.body,
			req.params.id
		)
		res.status(201).send(newPost)
		return
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
			return
		} else {
			res.sendStatus(204)
			return
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
*/
