"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRepository = exports.CommentRepository = exports.commentModel = exports.CommentsPaginationType = exports.CommentDBType = exports.CommentViewType = void 0;
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
            myStatus: 'None',
        };
        this.arraysOfUsersWhoLikeOrDis = {
            likeArray: [],
            dislikeArray: []
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
            likesCount: { type: Number, default: '0' },
            dislikesCount: { type: Number, default: '0' },
            arraysOfUsersWhoLikeOrDis: {
                type: {
                    likeArray: { type: Array, default: [] },
                    dislikeArray: { type: Array, default: [] },
                },
                required: false,
            },
        }, required: false,
    },
});
exports.commentModel = mongoose_1.default.model('comments', commentSchema);
class CommentRepository {
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield exports.commentModel.findOne({ id: id });
            const viewComment = new CommentViewType(foundComment === null || foundComment === void 0 ? void 0 : foundComment.id, foundComment === null || foundComment === void 0 ? void 0 : foundComment.content, {
                userId: foundComment === null || foundComment === void 0 ? void 0 : foundComment.commentatorInfo.userId,
                userLogin: foundComment === null || foundComment === void 0 ? void 0 : foundComment.commentatorInfo.userLogin
            }, foundComment === null || foundComment === void 0 ? void 0 : foundComment.createdAt, {
                likesCount: foundComment === null || foundComment === void 0 ? void 0 : foundComment.likesInfo.,
                dislikesCount: number,
                myStatus: string
            });
            return foundComment;
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
            const comments = yield exports.commentModel
                .find({ postId: id }, { projection: { _id: 0, postId: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
                .limit(pageSize)
                .lean();
            const totalCount = yield exports.commentModel.countDocuments({ postId: id });
            const pagesCount = Math.ceil(totalCount / pageSize);
            const commentsPagination = new CommentsPaginationType(pagesCount, Number(page), pageSize, totalCount, comments);
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
    updateCommentLikeStatus(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield exports.commentModel.updateOne({ id: id }, {
                $set: {
                    likeStatus: body.likeStatus,
                },
            });
            return resultOfUpdate.matchedCount === 1;
        });
    }
    createComment(newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.commentModel.insertMany(newComment);
            //@ts-ignore
            const { _id, postId } = newComment, commentWithout_Id = __rest(newComment, ["_id", "postId"]);
            return commentWithout_Id;
        });
    }
}
exports.CommentRepository = CommentRepository;
exports.commentsRepository = new CommentRepository();
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
