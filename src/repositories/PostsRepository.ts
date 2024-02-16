import { injectable } from 'inversify'
import mongoose from 'mongoose'
import { postLikesService } from '../services/postLikesService'
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
			myStatus: 'None',
			newestLikes: [],
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
	async findPost(params: { id: string }): Promise<postDBType | null> {
		let post: postDBType | null = await postModel.findOne({ id: params.id })
		return post
	}

	async findPostsByBlogId(
		params: {
			id: string
		},
		query: any,
		userId: string
	): Promise<postsByBlogIdPaginationType | undefined> {
		const totalCount: number = await postModel.countDocuments({
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
		let postsDB: postDBType[] = await postModel
			.find({ blogId: params.id }, { projection: { _id: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection })
			.limit(pageSize)
			.lean()
		let postsView: postViewType[] = []
		for (const post of postsDB) {
			let like = await postLikesService.findPostLikeFromUser(userId, post.id)
			let last3DBLikes = await postLikesService.findLast3Likes(post.id)
			let postView = {
				title: post.title,
				id: post.id,
				content: post.content,
				shortDescription: post.shortDescription,
				blogId: post.blogId,
				blogName: post.blogName,
				createdAt: post.createdAt,
				extendedLikesInfo: {
					likesCount: post.likesInfo.likesCount,
					dislikesCount: post.likesInfo.dislikesCount,
					myStatus: like?.likeStatus || 'None',
					newestLikes: last3DBLikes || [],
				},
			}
			postsView.push(postView)
		}
		const pageCount = Math.ceil(totalCount / pageSize)
		const postsPagination = {
			pagesCount: pageCount,
			page: page,
			pageSize: pageSize,
			totalCount: totalCount,
			items: postsView,
		}
		if (postsView) {
			return postsPagination
		} else {
			return
		}
	}

	async createPost(newPost: postDBType): Promise<boolean> {
		const result = await postModel.insertMany(newPost)
		return result.length == 1
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

	async updatePostLikesAndDislikesCount(
		postId: string,
		likesCount: number,
		dislikesCount: number
	): Promise<boolean> {
		const resultOfUpdate = await postModel.updateOne(
			{ id: postId },
			{
				$set: {
					'likesInfo.likesCount': likesCount,
					'likesInfo.dislikesCount': dislikesCount,
				},
			}
		)
		return resultOfUpdate.matchedCount === 1
	}

	async deletePost(params: { id: string }): Promise<boolean> {
		let result = await postModel.deleteOne({ id: params.id })
		return result.deletedCount === 1
	}
}
