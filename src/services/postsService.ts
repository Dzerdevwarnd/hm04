import { injectable } from 'inversify'
import {
	PostsRepository,
	postType,
	postsByBlogIdPaginationType,
} from '../repositories/PostsRepository'

@injectable()
export class PostsService {
	constructor(protected postsRepository: PostsRepository) {}
	async returnAllPosts(query: any): Promise<postsByBlogIdPaginationType> {
		return this.postsRepository.returnAllPosts(query)
	}

	async findPost(params: { id: string }): Promise<postType | undefined> {
		return this.postsRepository.findPost(params)
	}
	async createPost(body: {
		title: string
		shortDescription: string
		content: string
		blogId: string
	}): Promise<postType> {
		const createdDate = new Date()
		const newPost: postType = {
			id: String(Date.now()),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: body.blogId,
			blogName: '',
			createdAt: createdDate,
		}
		const postWithout_id = this.postsRepository.createPost(newPost)
		return postWithout_id
	}
	async createPostByBlogId(
		body: {
			title: string
			shortDescription: string
			content: string
		},
		id: string
	): Promise<postType> {
		const createdDate = new Date()
		const newPost: postType = {
			id: String(Date.now()),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: id,
			blogName: '',
			createdAt: createdDate,
		}
		const postWithout_id = this.postsRepository.createPost(newPost)
		return postWithout_id
	}
	async updatePost(
		id: string,
		body: {
			title: string
			shortDescription: string
			content: string
			blogId: string
		}
	): Promise<boolean> {
		const resultBoolean = this.postsRepository.updatePost(id, body)
		return resultBoolean
	}
	async deletePost(params: { id: string }): Promise<boolean> {
		const resultBoolean = this.postsRepository.deletePost(params)
		return resultBoolean
	}
}
