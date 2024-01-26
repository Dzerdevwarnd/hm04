import mongoose from 'mongoose'

export type postType = {
	id: string
	title: string
	shortDescription: string
	content: string
	blogId: string
	blogName: string
	createdAt: Date
}

export type postsByBlogIdPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: postType[]
}

const postSchema = new mongoose.Schema({
	id: { type: String, required: true },
	title: { type: String, required: true },
	shortDescription: { type: String, required: true },
	content: { type: String, required: true },
	blogId: { type: String, required: true },
	blogName: { type: String, default: '' },
	createdAt: { type: Date, required: true },
})

export const postModel = mongoose.model('posts', postSchema)

export const postsRepository = {
	async returnAllPosts(query: any): Promise<postsByBlogIdPaginationType> {
		const pageSize = Number(query?.pageSize) || 10
		const page = Number(query?.pageNumber) || 1
		const sortBy: string = query?.sortBy ?? 'createdAt'
		let sortDirection = query?.sortDirection ?? 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const posts = await postModel
			.find({}, '-_id -__v')
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection, createdAt: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await postModel.countDocuments()
		const pagesCount = Math.ceil(totalCount / pageSize)
		const postsPagination = {
			pagesCount: pagesCount,
			page: Number(page),
			pageSize: pageSize,
			totalCount: totalCount,
			items: posts,
		}
		return postsPagination
	},
	async findPost(params: { id: string }): Promise<postType | undefined> {
		let post: postType | null = await postModel.findOne(
			{ id: params.id },
			'-_id -__v'
		)
		if (post) {
			return post
		} else {
			return
		}
	},
	async createPost(newPost: postType): Promise<postType> {
		const result = await postModel.insertMany(newPost)
		//@ts-ignore
		const { _id, ...postWithout_Id } = newPost
		return postWithout_Id
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
		const result = await postModel.updateOne(
			{ id: id },
			{
				$set: {
					title: body.title,
					shortDescription: body.shortDescription,
					content: body.content,
					blogId: body.blogId,
				},
			}
		)
		return result.matchedCount === 1
	},
	async deletePost(params: { id: string }): Promise<boolean> {
		let result = await postModel.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
