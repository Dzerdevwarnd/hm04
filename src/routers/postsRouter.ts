import { Request, Response, Router } from 'express'
import { body } from 'express-validator'
import { jwtService } from '../application/jwt-service'
import {
	AuthMiddleware,
	basicAuthMiddleware,
} from '../middleware/authMiddleware'
import { inputValidationMiddleware } from '../middleware/inputValidationMiddleware'
import {
	postsByBlogIdPaginationType,
	postsRepository,
} from '../repositories/PostsRepository'
import { blogViewType } from '../repositories/blogsRepository'
import { CommentsRepository } from '../repositories/commentRepository'
import { blogsService } from '../services/blogsService'
import { CommentsService } from '../services/commentsService'
import { postsService } from '../services/postsService'
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>

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
			const blog: blogViewType | undefined = await blogsService.findBlog(params)
			if (!blog) {
				throw new Error('Blog id does not exist')
			}
		}
	),
	commentsContentValidation: body('content')
		.trim()
		.isLength({ min: 20, max: 300 })
		.withMessage('Content length should be from 20 to 300'),
}

const commentsServiceInstance = new CommentsService(new CommentsRepository())

postsRouter.get(
	'/',
	async (req: RequestWithQuery<{ query: any }>, res: Response) => {
		const allPosts: postsByBlogIdPaginationType =
			await postsService.returnAllPosts(req.query)
		res.status(200).send(allPosts)
		return
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
			return
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
		return
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
			return
		} else {
			res.sendStatus(204)
			return
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

postsRouter.get(
	'/:id/comments',
	async (
		req: RequestWithParamsAndQuery<{ id: string }, { query: any }>,
		res: Response
	) => {
		let userId = undefined
		if (req.headers.authorization) {
			userId = await jwtService.verifyAndGetUserIdByToken(
				req.headers.authorization.split(' ')[1]
			)
		}
		const commentsPagination =
			await commentsServiceInstance.findCommentsByPostId(
				req.params.id,
				req.query,
				userId
			)
		if (commentsPagination?.items.length === 0) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(commentsPagination)
			return
		}
	}
)

postsRouter.post(
	'/:id/comments',
	AuthMiddleware,
	postsValidation.commentsContentValidation,
	inputValidationMiddleware,
	async (
		req: RequestWithParamsAndBody<{ id: string }, { content: string }>,
		res: Response
	) => {
		const post = await postsRepository.findPost(req.params)
		if (!post) {
			res.sendStatus(404)
			return
		}
		const token = req.headers.authorization!.split(' ')[1]

		const comment = await commentsServiceInstance.createCommentsByPostId(
			req.params.id,
			req.body,
			token
		)
		if (!comment) {
			res.sendStatus(404)
			return
		} else {
			res.status(201).send(comment)
			return
		}
	}
)
