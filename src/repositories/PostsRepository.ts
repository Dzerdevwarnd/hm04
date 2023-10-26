import { client } from '../db'

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

export const postsRepository = {
	async returnAllPosts(query: any): Promise<postsByBlogIdPaginationType> {
		const pageSize = Number(query.pageSize) || 10
		const page = query.pageNumber || 1
		const sortBy = query.sortBy || 'createdAt'
		let sortDirection = query.sortDirection || 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const posts = await client
			.db('hm03')
			.collection<postType>('posts')
			.find({}, { projection: { _id: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.toArray()
		const totalCount = await client
			.db('hm03')
			.collection<postType>('posts')
			.countDocuments()
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
		let post: postType | null = await client
			.db('hm03')
			.collection<postType>('posts')
			.findOne({ id: params.id }, { projection: { _id: 0 } })
		if (post) {
			return post
		} else {
			return
		}
	},
	async createPost(newPost: postType): Promise<postType> {
		const result = await client
			.db('hm03')
			.collection<postType>('posts')
			.insertOne(newPost)
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
		const result = await client
			.db('hm03')
			.collection<postType>('posts')
			.updateOne(
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
		let result = await client
			.db('hm03')
			.collection<postType>('posts')
			.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
