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
	pageCount: number
	page: number
	pageSize: number
	totalCount: number
	items: postType[]
}

export const postsRepository = {
	async returnAllPosts(): Promise<postsByBlogIdPaginationType> {
		const totalCount: number = await client
			.db('hm03')
			.collection<postType>('posts')
			.countDocuments()
		const pageSize = 10
		const pageCount = Math.ceil(totalCount / pageSize)
		const page = 1
		const allPosts = await client
			.db('hm03')
			.collection<postType>('posts')
			.find({}, { projection: { _id: 0 } })
			.sort({ CreatedAt: 1 })
			.limit(10)
			.toArray()
		const postsPagination = {
			pageCount: pageCount,
			page: page,
			pageSize: pageSize,
			totalCount: totalCount,
			items: allPosts,
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
