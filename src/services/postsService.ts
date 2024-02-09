import { injectable } from 'inversify'
import {
	PostsRepository,
	postDBType,
	postModel,
	postViewType,
	postsByBlogIdPaginationType,
} from '../repositories/PostsRepository'
import { postLikesService } from './postLikesService'

@injectable()
export class PostsService {
	constructor(protected postsRepository: PostsRepository) {}
	async returnAllPosts(
		query: any,
		userId: string
	): Promise<postsByBlogIdPaginationType> {
		const postsDB = await this.postsRepository.findPostsWithQuery(query)
		const postsView: postViewType[] = []
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
					newestLikes: last3DBLikes,
				},
			}

			postsView.push(postView)
		}
		const totalCount = await postModel.countDocuments()
		const pagesCount = Math.ceil(totalCount / query.pageSize)
		const postsPagination = {
			pagesCount: pagesCount,
			page: Number(query.page),
			pageSize: query.pageSize,
			totalCount: totalCount,
			items: postsView,
		}
		return postsPagination
	}

	async findPost(
		params: { id: string },
		userId: string
	): Promise<postViewType | null> {
		const foundPost = await this.postsRepository.findPost(params)
		if (!foundPost) {
			return null
		}
		let like = await postLikesService.findPostLikeFromUser(userId, params.id)
		const postView = {
			id: foundPost.id,
			content: foundPost.content,
			commentatorInfo: {
				userId: like?.userId || 'string',
				userLogin: like?.login || 'string',
			},
			createdAt: foundPost.createdAt,
			likesInfo: {
				likesCount: Number(foundPost.likesInfo.likesCount),
				dislikesCount: Number(foundPost.likesInfo.dislikesCount),
				myStatus: like?.likeStatus || 'None',
			},
		}
		return postView
	}
	async createPost(body: {
		title: string
		shortDescription: string
		content: string
		blogId: string
	}): Promise<postDBType> {
		const createdDate = new Date()
		const newPost: postDBType = {
			id: String(Date.now()),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: body.blogId,
			blogName: '',
			createdAt: createdDate,
			likesInfo: {
				likesCount: 0,
				dislikesCount: 0,
			},
		}
		const postDB = await this.postsRepository.createPost(newPost)
		const postView = {
			id: postDB.id,
			title: postDB.title,
			shortDescription: postDB.shortDescription,
			content: postDB.content,
			blogId: postDB.blogId,
			blogName: postDB.blogName,
			createdAt: postDB.createdAt,
			extendedLikesInfo: {
				likesCount: 0,
				dislikesCount: 0,
				myStatus: 'None',
				newestLikes: [],
			},
		}
		return postView
	}
	async createPostByBlogId(
		body: {
			title: string
			shortDescription: string
			content: string
		},
		id: string
	): Promise<postDBType> {
		const createdDate = new Date()
		const newPost: postDBType = {
			id: String(Date.now()),
			title: body.title,
			shortDescription: body.shortDescription,
			content: body.content,
			blogId: id,
			blogName: '',
			createdAt: createdDate,
			likesInfo: {
				likesCount: 0,
				dislikesCount: 0,
			},
		}
		const postDB = this.postsRepository.createPost(newPost)
		const postView: postViewType = {}
		return postWithout_id
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
		const resultBoolean = this.postsRepository.updatePost(id, body)
		return resultBoolean
	}
	async deletePost(params: { id: string }): Promise<boolean> {
		const resultBoolean = this.postsRepository.deletePost(params)
		return resultBoolean
	}
}
