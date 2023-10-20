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

export const postsRepository = {
	async returnAllPosts(): Promise<postType[]> {
		return await client
			.db('hm03')
			.collection<postType>('posts')
			.find({}, { projection: { _id: 0 } })
			.toArray()
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
