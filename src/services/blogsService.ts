import {
	blogType,
	blogsPaginationType,
	blogsRepository,
} from '../repositories/blogsRepository'

import { postsByBlogIdPaginationType } from '../repositories/PostsRepository'

export const blogsService = {
	async returnAllBlogs(query: any): Promise<blogsPaginationType> {
		return blogsRepository.returnAllBlogs(query)
	},
	async findBlog(params: { id: string }): Promise<blogType | undefined> {
		return blogsRepository.findBlog(params)
	},
	async findPostsByBlogId(
		params: {
			id: string
		},
		query: any
	): Promise<postsByBlogIdPaginationType | undefined> {
		return blogsRepository.findPostsByBlogId(params, query)
	},
	async createBlog(body: {
		name: string
		description: string
		websiteUrl: string
	}): Promise<blogType> {
		const createdDate = new Date()
		const newBlog: blogType = {
			id: String(Date.now()),
			name: body.name,
			description: body.description,
			websiteUrl: body.websiteUrl,
			createdAt: createdDate,
			isMembership: false,
		}
		const newBlogWithout_id = blogsRepository.createBlog(newBlog)
		return newBlogWithout_id
	},
	async updateBlog(
		id: string,
		body: { name: string; description: string; websiteUrl: string }
	): Promise<boolean> {
		const resultBoolean = blogsRepository.updateBlog(id, body)
		return resultBoolean
	},
	async deleteBlog(params: { id: string }): Promise<boolean> {
		let resultBoolean = blogsRepository.deleteBlog(params)
		return resultBoolean
	},
}
