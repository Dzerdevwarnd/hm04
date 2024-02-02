"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsRepository = exports.commentModel = exports.CommentsPaginationType = exports.CommentDBType = exports.CommentViewType = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
class CommentViewType {
    constructor(id, content, commentatorInfo, createdAt, likesInfo) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = likesInfo;
    }
}
exports.CommentViewType = CommentViewType;
/*export type commentType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: Date
}*/
class CommentDBType {
    constructor(_id, id, postId, content, commentatorInfo, createdAt) {
        this._id = _id;
        this.id = id;
        this.postId = postId;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
        };
    }
}
exports.CommentDBType = CommentDBType;
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
class CommentsPaginationType {
    constructor(pagesCount, page, pageSize, totalCount, items) {
        this.pagesCount = pagesCount;
        this.page = page;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.items = items;
    }
}
exports.CommentsPaginationType = CommentsPaginationType;
/*export type commentsPaginationType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}*/
const commentSchema = new mongoose_1.default.Schema({
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
        type: {
            likesCount: { type: Number, required: true, default: '0' },
            dislikesCount: { type: Number, required: true, default: '0' },
        },
        required: true,
    },
});
exports.commentModel = mongoose_1.default.model('comments', commentSchema);
let CommentsRepository = class CommentsRepository {
    findComment(commentId, userLikeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield exports.commentModel.findOne({ id: commentId });
            if (!foundComment) {
                return null;
            }
            const viewComment = new CommentViewType(foundComment.id, foundComment.content, {
                userId: foundComment.commentatorInfo.userId,
                userLogin: foundComment.commentatorInfo.userLogin,
            }, foundComment.createdAt, {
                likesCount: foundComment.likesInfo.likesCount,
                dislikesCount: foundComment.likesInfo.dislikesCount,
                myStatus: userLikeStatus,
            });
            return viewComment;
        });
    }
    findDBCommentsByPostIdWithoutLikeStatus(postId, query) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = Number(query === null || query === void 0 ? void 0 : query.pageSize) || 10;
            const page = Number(query === null || query === void 0 ? void 0 : query.pageNumber) || 1;
            const sortBy = (_a = query === null || query === void 0 ? void 0 : query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            let sortDirection = (_b = query === null || query === void 0 ? void 0 : query.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const commentsDB = yield exports.commentModel
                .find({ postId: postId })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
                .limit(pageSize)
                .lean();
            return commentsDB;
        });
    }
    findCommentsByPostId(id, query) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = Number(query === null || query === void 0 ? void 0 : query.pageSize) || 10;
            const page = Number(query === null || query === void 0 ? void 0 : query.pageNumber) || 1;
            const sortBy = (_a = query === null || query === void 0 ? void 0 : query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            let sortDirection = (_b = query === null || query === void 0 ? void 0 : query.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const commentsDB = yield exports.commentModel
                .find({ postId: id }, { projection: { _id: 0, postId: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
                .limit(pageSize)
                .lean();
            const commentsView = commentsDB.map(comment => {
                /*let userLikeStatus = ''
                    if (comment.likesInfo.arraysOfUsersWhoLikeOrDis?.likeArray.includes(userId)){
                        userLikeStatus = "Like"
                    } else if (comment.likesInfo.arraysOfUsersWhoLikeOrDis?.dislikeArray.includes(userId)){
                        userLikeStatus = "Dislike"
                    } else {
                        userLikeStatus = "None"
                    }*/
                return {
                    id: comment.id,
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesInfo.likesCount,
                        dislikesCount: comment.likesInfo.dislikesCount,
                        myStatus: 'None', //userLikeStatus
                    },
                };
            });
            const totalCount = yield exports.commentModel.countDocuments({ postId: id });
            const pagesCount = Math.ceil(totalCount / pageSize);
            const commentsPagination = new CommentsPaginationType(pagesCount, Number(page), pageSize, totalCount, commentsView);
            return commentsPagination;
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfDelete = yield exports.commentModel.deleteOne({ id: id });
            return resultOfDelete.deletedCount === 1;
        });
    }
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield exports.commentModel.updateOne({ id: id }, {
                $set: {
                    content: body.content,
                },
            });
            return resultOfUpdate.matchedCount === 1;
        });
    }
    updateCommentLikesAndDislikesCount(commentId, likesCount, dislikesCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield exports.commentModel.updateOne({ id: commentId }, {
                $set: {
                    'likesInfo.likesCount': likesCount,
                    'likesInfo.dislikesCount': dislikesCount,
                },
            });
            return resultOfUpdate.matchedCount === 1;
        });
    }
    createComment(newComment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.commentModel.insertMany(newComment);
            //@ts-ignore
            const viewComment = new CommentViewType(newComment.id, newComment.content, {
                userId: newComment.commentatorInfo.userId,
                userLogin: newComment.commentatorInfo.userLogin,
            }, newComment.createdAt, {
                likesCount: newComment.likesInfo.likesCount,
                dislikesCount: newComment.likesInfo.dislikesCount,
                myStatus: 'None',
            });
            return viewComment;
        });
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsRepository);
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
