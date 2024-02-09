import { Request, Response } from 'express'
import { injectable } from 'inversify'
import { blogsPaginationType } from '../repositories/blogsRepository'
import { BlogsService } from '../services/blogsService'
import { PostsService } from '../services/postsService'

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParamsAndBody<P, B> = Request<P, {}, B>
type RequestParamsQuery<P, Q> = Request<P, {}, {}, Q>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>

@injectable()
export class BlogsController {
	constructor(
		protected blogsService: BlogsService,

		protected postsService: PostsService
	) {}
	async getBlogsWithPagination(
		req: RequestWithQuery<{ query: any }>,
		res: Response
	) {
		const blogsPagination: blogsPaginationType =
			await this.blogsService.returnAllBlogs(req.query)
		res.status(200).send(blogsPagination)
		return
	}
	async getBlogById(
		req: RequestParamsQuery<{ id: string }, { query: any }>,
		res: Response
	) {
		const foundPosts = await this.blogsService.findPostsByBlogId(
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
	async getPostsByBlogId(
		req: RequestParamsQuery<{ id: string }, { query: any }>,
		res: Response
	) {
		const foundPosts = await this.blogsService.findPostsByBlogId(
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
	async postBlog(
		req: RequestWithBody<{
			name: string
			description: string
			websiteUrl: string
		}>,
		res: Response
	) {
		const newBlog = await this.blogsService.createBlog(req.body)
		res.status(201).send(newBlog)
		return
	}
	async createPostByBlogId(
		req: RequestWithParamsAndBody<
			{ id: string },
			{
				title: string
				shortDescription: string
				content: string
			}
		>,
		res: Response
	) {
		if ((await this.blogsService.findBlog(req.params)) === undefined) {
			res.sendStatus(404)
			return
		}
		const newPost = await this.postsService.createPostByBlogId(
			req.body,
			req.params.id
		)
		res.status(201).send(newPost)
		return
	}
	async updateBlog(
		req: RequestWithParamsAndBody<
			{ id: string },
			{
				name: string
				description: string
				websiteUrl: string
			}
		>,
		res: Response
	) {
		const resultOfUpdateBlog = await this.blogsService.updateBlog(
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
	async deleteBlogByID(req: RequestWithParams<{ id: string }>, res: Response) {
		const ResultOfDeleteBlog = await this.blogsService.deleteBlog(req.params)
		if (!ResultOfDeleteBlog) {
			res.sendStatus(404)
			return
		} else {
			res.sendStatus(204)
			return
		}
	}
}
