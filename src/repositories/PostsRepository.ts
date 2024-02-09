import { injectable } from 'inversify'
import mongoose from 'mongoose'
import { postLikeViewType } from './postLikesRepository'

export class postDBType {
	public likesInfo: {
		likesCount: number
		dislikesCount: number
	}
	constructor(
		public id: string,
		public title: string,
		public shortDescription: string,
		public content: string,
		public blogId: string,
		public blogName: string,
		public createdAt: Date
	) {
		this.likesInfo = {
			likesCount: 0,
			dislikesCount: 0,
		}
	}
}

export class postViewType {
	extendedLikesInfo: {
		likesCount: number
		dislikesCount: number
		myStatus: string
		newestLikes: postLikeViewType[]
	}
	constructor(
		public id: string,
		public title: string,
		public shortDescription: string,
		public content: string,
		public blogId: string,
		public blogName: string,
		public createdAt: Date
	) {
		this.extendedLikesInfo = {
			likesCount: 0,
			dislikesCount: 0,
			myStatus: None,
		}
	}
}

export type postsByBlogIdPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: postViewType[]
}

const postSchema = new mongoose.Schema({
	id: { type: String, required: true },
	title: { type: String, required: true },
	shortDescription: { type: String, required: true },
	content: { type: String, required: true },
	blogId: { type: String, required: true },
	blogName: { type: String, default: '' },
	createdAt: { type: Date, required: true },
	likesInfo: {
		type: {
			likesCount: { type: Number, required: true, default: 0 },
			dislikesCount: { type: Number, required: true, default: 0 },
		},
		required: true,
	},
})

export const postModel = mongoose.model('posts', postSchema)

@injectable()
export class PostsRepository {
	async findPostsWithQuery(query: any): Promise<postDBType[]> {
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
		return posts
	}
	async findPost(params: { postId: string }): Promise<postDBType | undefined> {
		let post: postDBType | null = await postModel.findOne(
			{ id: params.id },
			'-_id -__v'
		)
		if (post) {
			return post
		} else {
			return
		}
	}
	async createPost(newPost: postDBType): Promise<postDBType> {
		const result = await postModel.insertMany(newPost)
		//@ts-ignore
		const { _id, ...postWithout_Id } = newPost
		return postWithout_Id
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
	}
	async deletePost(params: { id: string }): Promise<boolean> {
		let result = await postModel.deleteOne({ id: params.id })
		return result.deletedCount === 1
	}
}
