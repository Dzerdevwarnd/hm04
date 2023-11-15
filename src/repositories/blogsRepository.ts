import { client } from '../db'
import { postType, postsByBlogIdPaginationType } from './PostsRepository'

export type blogType = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
}

export type blogsPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: blogType[]
}

export const blogsRepository = {
	async returnAllBlogs(query: any): Promise<blogsPaginationType> {
		const pageSize = Number(query.pageSize) || 10
		const page = Number(query.pageNumber) || 1
		const sortBy: string = query.sortBy || 'createdAt'
		const searchNameTerm: string = query.searchNameTerm || ''
		let sortDirection = query.sortDirection || 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const blogs = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.find(
				{ name: { $regex: searchNameTerm, $options: 'i' } },
				{ projection: { _id: 0 } }
			)
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.toArray()
		const totalCount = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.countDocuments({ name: { $regex: searchNameTerm, $options: 'i' } })
		const pagesCount = Math.ceil(totalCount / pageSize)
		const blogsPagination = {
			pagesCount: pagesCount,
			page: Number(page),
			pageSize: pageSize,
			totalCount: totalCount,
			items: blogs,
		}
		return blogsPagination
	},
	async findBlog(params: { id: string }): Promise<blogType | undefined> {
		let blog: blogType | null = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.findOne({ id: params.id }, { projection: { _id: 0 } })
		if (blog) {
			return blog
		} else {
			return
		}
	},
	async findPostsByBlogId(
		params: {
			id: string
		},
		query: any
	): Promise<postsByBlogIdPaginationType | undefined> {
		const totalCount: number = await client
			.db('hm03')
			.collection<postType>('posts')
			.countDocuments({ blogId: params.id })
		const pageSize = Number(query.pageSize) || 10
		const page = Number(query.pageNumber) || 1
		const sortBy: string = query.sortBy || 'createdAt'
		let sortDirection = query.sortDirection || 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		let posts: postType[] | null = await client
			.db('hm03')
			.collection<postType>('posts')
			.find({ blogId: params.id }, { projection: { _id: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.toArray()
		const pageCount = Math.ceil(totalCount / pageSize)
		const postsPagination = {
			pagesCount: pageCount,
			page: page,
			pageSize: pageSize,
			totalCount: totalCount,
			items: posts,
		}
		if (posts) {
			return postsPagination
		} else {
			return
		}
	},

	async createBlog(newBlog: blogType): Promise<blogType> {
		const result = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.insertOne(newBlog)
		//@ts-ignore
		const { _id, ...blogWithout_Id } = newBlog
		return blogWithout_Id
	},
	async updateBlog(
		id: string,
		body: { name: string; description: string; websiteUrl: string }
	): Promise<boolean> {
		const result = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.updateOne(
				{ id: id },
				{
					$set: {
						name: body.name,
						description: body.description,
						websiteUrl: body.websiteUrl,
					},
				}
			)
		return result.matchedCount === 1
	},
	async deleteBlog(params: { id: string }): Promise<boolean> {
		let result = await client
			.db('hm03')
			.collection<blogType>('blogs')
			.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
//
