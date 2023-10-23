import {
	postType,
	postsByBlogIdPaginationType,
	postsRepository,
} from '../repositories/PostsRepository'

export const postsService = {
	async returnAllPosts(): Promise<postsByBlogIdPaginationType> {
		return postsRepository.returnAllPosts()
	},

	async findPost(params: { id: string }): Promise<postType | undefined> {
		return postsRepository.findPost(params)
	},
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
		const postWithout_id = postsRepository.createPost(newPost)
		return postWithout_id
	},
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
		const postWithout_id = postsRepository.createPost(newPost)
		return postWithout_id
	},
	async updatePost(
		id: string,
		body: {
			title: string
			shortDescription: string
			content: string
			blogId: string
		}
	): Promise<boolean> {
		const resultBoolean = postsRepository.updatePost(id, body)
		return resultBoolean
	},
	async deletePost(params: { id: string }): Promise<boolean> {
		const resultBoolean = postsRepository.deletePost(params)
		return resultBoolean
	},
}
