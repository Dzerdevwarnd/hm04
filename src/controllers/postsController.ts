import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { jwtService } from '../application/jwt-service'
import { postsByBlogIdPaginationType } from '../repositories/PostsRepository'
import { CommentsService } from '../services/commentsService'
import { PostsService } from '../services/postsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>

@injectable()
export class PostsController {
	constructor(
		protected postsService: PostsService,
		protected commentService: CommentsService
	) {}
	async getPostsWithPagination(
		req: RequestWithQuery<{ query: any }>,
		res: Response
	) {
		const allPosts: postsByBlogIdPaginationType =
			await this.postsService.returnAllPosts(req.query)
		res.status(200).send(allPosts)
		return
	}
	async getPostById(req: RequestWithParams<{ id: string }>, res: Response) {
		const foundPost = await this.postsService.findPost(req.params)
		if (!foundPost) {
			res.sendStatus(404)
			return
		} else {
			res.status(200).send(foundPost)
			return
		}
	}
	async postPost(
		req: RequestWithBody<{
			title: string
			shortDescription: string
			content: string
			blogId: string
		}>,
		res: Response
	) {
		const newPost = await this.postsService.createPost(req.body)
		res.status(201).send(newPost)
		return
	}
	async updatePost(
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
	) {
		const ResultOfUpdatePost = await this.postsService.updatePost(
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
	async deleteById(req: RequestWithParams<{ id: string }>, res: Response) {
		const resultOfDelete = await this.postsService.deletePost(req.params)
		if (!resultOfDelete) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
	async getCommentsByPostId(
		req: RequestWithParamsAndQuery<{ id: string }, { query: any }>,
		res: Response
	) {
		let userId = undefined
		if (req.headers.authorization) {
			userId = await jwtService.verifyAndGetUserIdByToken(
				req.headers.authorization.split(' ')[1]
			)
		}
		const commentsPagination = await this.commentService.findCommentsByPostId(
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
	async postCommentByPostId(
		req: RequestWithParamsAndBody<{ id: string }, { content: string }>,
		res: Response
	) {
		{
			const post = await this.postsService.findPost(req.params)
			if (!post) {
				res.sendStatus(404)
				return
			}
			const token = req.headers.authorization!.split(' ')[1]

			const comment = await this.commentService.createCommentsByPostId(
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
	}
}
