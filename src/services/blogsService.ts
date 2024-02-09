import { injectable } from 'inversify'
import {
	BlogsRepository,
	blogDBType,
	blogViewType,
	blogsPaginationType,
} from '../repositories/blogsRepository'

import { postsByBlogIdPaginationType } from '../repositories/PostsRepository'
@injectable()
export class BlogsService {
	constructor(protected blogsRepository: BlogsRepository) {}
	async returnAllBlogs(query: any): Promise<blogsPaginationType> {
		return this.blogsRepository.returnAllBlogs(query)
	}
	async findBlog(params: { id: string }): Promise<blogViewType | undefined> {
		return this.blogsRepository.findBlog(params)
	}
	async findPostsByBlogId(
		params: {
			id: string
		},
		query: any
	): Promise<postsByBlogIdPaginationType | undefined> {
		return this.blogsRepository.findPostsByBlogId(params, query)
	}
	async createBlog(body: {
		name: string
		description: string
		websiteUrl: string
	}): Promise<blogViewType> {
		const createdDate = new Date()
		const newBlog: blogDBType = {
			id: String(Date.now()),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt: createdDate,
			isMembership: false,
		}
		const newBlogWithout_id = this.blogsRepository.createBlog(newBlog)
		return newBlogWithout_id
	}
	async updateBlog(
		id: string,
		body: { name: string; description: string; websiteUrl: string }
	): Promise<boolean> {
		const resultBoolean = this.blogsRepository.updateBlog(id, body)
		return resultBoolean
	}
	async deleteBlog(params: { id: string }): Promise<boolean> {
		let resultBoolean = this.blogsRepository.deleteBlog(params)
		return resultBoolean
	}
}
