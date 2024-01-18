import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

export class CommentViewType {
	constructor(
		public id: string,
		public content: string,
		public commentatorInfo: {
        userId: string,
        userLogin: string
      },
			public  createdAt: Date,
			public likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string

    }
	) {}
}

/*export type commentType = {
	id: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: Date
}*/

export class CommentDBType {
	public likesInfo: {
		likesCount: number
		dislikesCount: number
		myStatus: string
	}
	public arraysOfUsersWhoLikeOrDis:{
		likeArray:string[]
		dislikeArray:string[]
	}
	constructor(
		public _id: ObjectId,
		public id: string,
		public postId: string,
		public content: string,
		public commentatorInfo: {
			userId: string
			userLogin: string
		},
		public createdAt: Date,

	) {
		this.likesInfo = {
			likesCount: 0,
			dislikesCount: 0,
			myStatus: 'None',
		}
		this.arraysOfUsersWhoLikeOrDis = {
			likeArray :[],
			dislikeArray : []
		}
	}
}

/*export type commentDBType = {
	id: string
	postId: string
	content: string
	commentatorInfo: {
		userId: string
		userLogin: string
	}
	createdAt: Date
}*/

export class CommentsPaginationType {
	constructor(
		public pagesCount: number,
		public page: number,
		public pageSize: number,
		public totalCount: number,
		public items: CommentViewType[]
	) {}
}

/*export type commentsPaginationType = {
	pagesCount: number
	page: number
	pageSize: number
	totalCount: number
	items: CommentType[]
}*/

const commentSchema = new mongoose.Schema({
	id: { type: String, required: true },
	postId: { type: String, required: true },
	content: { type: String, required: true },
	commentatorInfo: {
		type: {
			userId: { type: String, required: true },
			userLogin: { type: String, required: true },
		},
		required: true,
	},
	createdAt: { type: Date, required: true },
	likesInfo: {
		type:{
			likesCount: {type:Number,default:'0'},
		dislikesCount: {type:Number,default:'0'},
		arraysOfUsersWhoLikeOrDis:{
			type:{
				likeArray:{type:Array,default:[]},
			dislikeArray:{type:Array,default:[]},
		},
		required:false,
	},
},required:false,
},})

export const commentModel = mongoose.model('comments', commentSchema)

export class CommentRepository {
	async findComment(id: string): Promise<CommentViewType | null> {
		const foundComment = await commentModel.findOne(
			{ id: id },
		)
	const viewComment:CommentViewType = new CommentViewType(
		foundComment?.id,
		foundComment?.content,
{
	userId:foundComment?.commentatorInfo.userId,
	userLogin:foundComment?.commentatorInfo.userLogin
      },
			foundComment?.createdAt,
			{
        likesCount: foundComment?.likesInfo.,
        dislikesCount: number,
        myStatus: string)

		return foundComment
	}

	async findCommentsByPostId(
		id: string,
		query: any
	): Promise<CommentsPaginationType | null> {
		const pageSize = Number(query?.pageSize) || 10
		const page = Number(query?.pageNumber) || 1
		const sortBy: string = query?.sortBy ?? 'createdAt'
		let sortDirection = query?.sortDirection ?? 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const comments = await commentModel
			.find({ postId: id }, { projection: { _id: 0, postId: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection, createdAt: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await commentModel.countDocuments({ postId: id })
		const pagesCount = Math.ceil(totalCount / pageSize)
		const commentsPagination: CommentsPaginationType =
			new CommentsPaginationType(
				pagesCount,
				Number(page),
				pageSize,
				totalCount,
				comments
			)
		return commentsPagination
	}

	async deleteComment(id: string): Promise<boolean> {
		const resultOfDelete = await commentModel.deleteOne({ id: id })
		return resultOfDelete.deletedCount === 1
	}

	async updateComment(id: string, body: { content: string }): Promise<boolean> {
		const resultOfUpdate = await commentModel.updateOne(
			{ id: id },
			{
				$set: {
					content: body.content,
				},
			}
		)
		return resultOfUpdate.matchedCount === 1
	}

	async updateCommentLikeStatus(
		id: string,
		body: { likeStatus: string }
	): Promise<boolean> {
		const resultOfUpdate = await commentModel.updateOne(
			{ id: id },
			{
				$set: {
					likeStatus: body.likeStatus,
				},
			}
		)
		return resultOfUpdate.matchedCount === 1
	}

	async createComment(newComment: CommentDBType): Promise<CommentType> {
		const result = await commentModel.insertMany(newComment)
		//@ts-ignore
		const { _id, postId, ...commentWithout_Id } = newComment
		return commentWithout_Id
	}
}

export const commentsRepository = new CommentRepository()

/*export const commentsRepository = {
	async findComment(id: string): Promise<CommentType | null> {
		const foundComment = await commentModel.findOne(
			{ id: id },
			{ projection: { _id: 0, postId: 0 } }
		)
		return foundComment
	},

	async findCommentsByPostId(
		id: string,
		query: any
	): Promise<CommentsPaginationType | null> {
		const pageSize = Number(query?.pageSize) || 10
		const page = Number(query?.pageNumber) || 1
		const sortBy: string = query?.sortBy ?? 'createdAt'
		let sortDirection = query?.sortDirection ?? 'desc'
		if (sortDirection === 'desc') {
			sortDirection = -1
		} else {
			sortDirection = 1
		}
		const comments = await commentModel
			.find({ postId: id }, { projection: { _id: 0, postId: 0 } })
			.skip((page - 1) * pageSize)
			.sort({ [sortBy]: sortDirection, createdAt: sortDirection })
			.limit(pageSize)
			.lean()
		const totalCount = await commentModel.countDocuments({ postId: id })
		const pagesCount = Math.ceil(totalCount / pageSize)
		const commentsPagination: CommentsPaginationType =
			new CommentsPaginationType(
				pagesCount,
				Number(page),
				pageSize,
				totalCount,
				comments
			)
		return commentsPagination
	},

	async deleteComment(id: string): Promise<boolean> {
		const resultOfDelete = await commentModel.deleteOne({ id: id })
		return resultOfDelete.deletedCount === 1
	},

	async updateComment(id: string, body: { content: string }): Promise<boolean> {
		const resultOfUpdate = await commentModel.updateOne(
			{ id: id },
			{
				$set: {
					content: body.content,
				},
			}
		)
		return resultOfUpdate.matchedCount === 1
	},

	async createComment(newComment: CommentDBType): Promise<CommentType> {
		const result = await commentModel.insertMany(newComment)
		//@ts-ignore
		const { _id, postId, ...commentWithout_Id } = newComment
		return commentWithout_Id
	},
}*/
