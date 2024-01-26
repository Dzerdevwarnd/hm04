import mongoose from 'mongoose'
import {
	postModel,
	postType,
	postsByBlogIdPaginationType,
} from './PostsRepository'

export type blogDBType = {
	id: string
	name: string
	description: string
	websiteUrl: string
	createdAt: Date
	isMembership: boolean
}

export type blogViewType = {
	createdAt: Date
	description: string
	id: string
	isMembership: boolean
	name: string
}

export type blogsPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: blogDBType[]
}

const blogSchema = new mongoose.Schema({
	id: { type: String, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	websiteUrl: { type: String, required: true },
	createdAt: { type: Date, required: true },
	isMembership: { type: Boolean, required: true },
})

export const blogModel = mongoose.model('blogs', blogSchema)

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
		const blogs = await blogModel
			.find(
				{ name: { $regex: searchNameTerm, $options: 'i' } },
				{ projection: { _id: 0 } }
			)
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await blogModel.countDocuments({
			name: { $regex: searchNameTerm, $options: 'i' },
		})
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
	async findBlog(params: { id: string }): Promise<blogViewType | undefined> {
		let blog: blogDBType | null = await blogModel.findOne({ id: params.id })
		if (!blog) {
			return
		}
		const blogView = {
			createdAt: blog.createdAt,
			description: blog.description,
			id: blog.id,
			isMembership: blog.isMembership,
			name: blog.name,
			websiteUrl: blog.websiteUrl,
		}
		return blogView
	},
	async findPostsByBlogId(
		params: {
			id: string
		},
		query: any
	): Promise<postsByBlogIdPaginationType | undefined> {
		const totalCount: number = await blogModel.countDocuments({
			blogId: params.id,
		})
		const pageSize = Number(query.pageSize) || 10
		const page = Number(query.pageNumber) || 1
		const sortBy: string = query.sortBy || 'createdAt'
		let sortDirection = query.sortDirection || 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		let posts: postType[] = await postModel
			.find({ blogId: params.id }, { projection: { _id: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.lean()
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

	async createBlog(newBlog: blogDBType): Promise<blogDBType> {
		const result = await blogModel.insertMany(newBlog)
		//@ts-ignore
		const { _id, ...blogWithout_Id } = newBlog
		return blogWithout_Id
	},
	async updateBlog(
		id: string,
		body: { name: string; description: string; websiteUrl: string }
	): Promise<boolean> {
		const result = await blogModel.updateOne(
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
		let result = await blogModel.deleteOne({ id: params.id })
		return result.deletedCount === 1
	},
}
//
