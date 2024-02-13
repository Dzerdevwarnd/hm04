"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const inversify_1 = require("inversify");
const mongodb_1 = require("mongodb");
const jwt_service_1 = require("../application/jwt-service");
const UsersRepository_1 = require("../repositories/UsersRepository");
const commentRepository_1 = require("../repositories/commentRepository");
const commentLikesService_1 = require("./commentLikesService");
let CommentsService = class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    findComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield commentLikesService_1.commentsLikesService.findCommentLikeFromUser(userId, commentId);
            const userLikeStatus = (like === null || like === void 0 ? void 0 : like.likeStatus) || 'None';
            let comment = yield this.commentsRepository.findComment(commentId, userLikeStatus);
            return comment;
        });
    }
    findCommentsByPostId(postId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentsDB = yield this.commentsRepository.findDBCommentsByPostIdWithoutLikeStatus(postId, query);
            if (!commentsDB) {
                return null;
            }
            const commentsView = [];
            for (const comment of commentsDB) {
                let like = yield commentLikesService_1.commentsLikesService.findCommentLikeFromUser(userId, comment.id);
                let commentView = {
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
                        myStatus: (like === null || like === void 0 ? void 0 : like.likeStatus) || 'None',
                    },
                };
                commentsView.push(commentView);
            }
            const totalCount = yield commentRepository_1.commentModel.countDocuments({ postId: postId });
            const pagesCount = Math.ceil(totalCount / Number(query === null || query === void 0 ? void 0 : query.pageSize) || 1);
            const commentsPagination = new commentRepository_1.CommentsPaginationType(pagesCount, Number(query === null || query === void 0 ? void 0 : query.pageNumber) || 1, Number(query === null || query === void 0 ? void 0 : query.pageSize) || 10, totalCount, commentsView);
            return commentsPagination;
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.commentsRepository.deleteComment(commentId);
            return result;
        });
    }
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.commentsRepository.updateComment(id, body);
            return result;
        });
    }
    updateCommentLikeStatus(commentId, body, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(accessToken);
            const comment = yield this.findComment(commentId, userId);
            let likesCount = comment.likesInfo.likesCount;
            let dislikesCount = comment.likesInfo.dislikesCount;
            if (body.likeStatus === 'Like' && (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) !== 'Like') {
                likesCount = +likesCount + 1;
                if ((comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) === 'Dislike') {
                    dislikesCount = +dislikesCount - 1;
                }
                this.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'Dislike' &&
                (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) !== 'Dislike') {
                dislikesCount = +dislikesCount + 1;
                if ((comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) === 'Like') {
                    likesCount = +likesCount - 1;
                }
                this.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'None' &&
                (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) === 'Like') {
                likesCount = likesCount - 1;
                this.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'None' &&
                (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) === 'Dislike') {
                dislikesCount = dislikesCount - 1;
                this.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount, dislikesCount);
            }
            let like = yield commentLikesService_1.commentsLikesService.findCommentLikeFromUser(userId, commentId);
            if (!like) {
                yield commentLikesService_1.commentsLikesService.addLikeToBdFromUser(userId, commentId, body.likeStatus);
                return true;
            }
            else {
                if (like.likeStatus === body.likeStatus) {
                    return false;
                }
                commentLikesService_1.commentsLikesService.updateUserLikeStatus(userId, commentId, body.likeStatus);
                return true;
            }
        });
    }
    createCommentsByPostId(id, body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(token);
            const user = yield UsersRepository_1.usersRepository.findUser(userId);
            if (!user) {
                return user;
            }
            const comment = new commentRepository_1.CommentDBType(new mongodb_1.ObjectId(), String(Date.now()), id, body.content, { userId: user.id, userLogin: user.accountData.login }, new Date());
            const commentView = yield this.commentsRepository.createComment(comment, userId);
            return commentView;
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [commentRepository_1.CommentsRepository])
], CommentsService);
/*
export const commentService = {
    async findComment(
        commentId: string,
        userId: string
    ): Promise<CommentViewType | null> {
        const like = await commentsLikesService.findCommentLikeFromUser(userId, commentId)
        const userLikeStatus = like?.likeStatus || 'None'
        let comment = await commentsRepository.findComment(
            commentId,
            userLikeStatus
        )
        return comment
    },
    async findCommentsByPostId(
        postId: string,
        query: any,
        userId: string
    ): Promise<CommentsPaginationType | null> {
        let commentsDB =
            await commentsRepository.findDBCommentsByPostIdWithoutLikeStatus(
                postId,
                query
            )
        if (!commentsDB) {
            return null
        }
        const commentsView: CommentViewType[] = []
        for (const comment of commentsDB) {
            let like = await commentsLikesService.findCommentLikeFromUser(userId, comment.id)
            let commentView = {
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
                    myStatus: like?.likeStatus || 'None',
                },
            }
            commentsView.push(commentView)
        }
        const totalCount = await commentModel.countDocuments({ postId: postId })
        const pagesCount = Math.ceil(totalCount / Number(query?.pageSize) || 1)
        const commentsPagination: CommentsPaginationType =
            new CommentsPaginationType(
                pagesCount,
                Number(query?.pageNumber) || 1,
                Number(query?.pageSize) || 10,
                totalCount,
                commentsView
            )
        return commentsPagination
    },
    async deleteComment(commentId: string): Promise<boolean> {
        let result = await commentsRepository.deleteComment(commentId)
        return result
    },
    async updateComment(id: string, body: { content: string }): Promise<boolean> {
        let result = await commentsRepository.updateComment(id, body)
        return result
    },
    async updateCommentLikeStatus(
        commentId: string,
        body: { likeStatus: string },
        accessToken: string
    ): Promise<boolean> {
        const userId = await jwtService.verifyAndGetUserIdByToken(accessToken)
        const comment = await commentService.findComment(commentId, userId)
        let likesCount = comment!.likesInfo.likesCount
        let dislikesCount = comment!.likesInfo.dislikesCount
        if (body.likeStatus === 'Like' && comment?.likesInfo.myStatus !== 'Like') {
            likesCount = +likesCount + 1
            if (comment?.likesInfo.myStatus === 'Dislike') {
                dislikesCount = +dislikesCount - 1
            }
            commentsRepository.updateCommentLikesAndDislikesCount(
                commentId,
                likesCount,
                dislikesCount
            )
        } else if (
            body.likeStatus === 'Dislike' &&
            comment?.likesInfo.myStatus !== 'Dislike'
        ) {
            dislikesCount = +dislikesCount + 1
            if (comment?.likesInfo.myStatus === 'Like') {
                likesCount = +likesCount - 1
            }
            commentsRepository.updateCommentLikesAndDislikesCount(
                commentId,
                likesCount,
                dislikesCount
            )
        } else if (
            body.likeStatus === 'None' &&
            comment?.likesInfo.myStatus === 'Like'
        ) {
            likesCount = likesCount - 1
            commentsRepository.updateCommentLikesAndDislikesCount(
                commentId,
                likesCount,
                dislikesCount
            )
        } else if (
            body.likeStatus === 'None' &&
            comment?.likesInfo.myStatus === 'Dislike'
        ) {
            dislikesCount = dislikesCount - 1
            commentsRepository.updateCommentLikesAndDislikesCount(
                commentId,
                likesCount,
                dislikesCount
            )
        }
        let like = await commentsLikesService.findCommentLikeFromUser(userId, commentId)
        if (!like) {
            await commentsLikesService.addLikeToBdFromUser(userId, commentId, body.likeStatus)
            return true
        } else {
            if (like.likeStatus === body.likeStatus) {
                return false
            }
            commentsLikesService.updateUserLikeStatus(userId, commentId, body.likeStatus)
            return true
        }
    },
    async createCommentsByPostId(
        id: string,
        body: { content: string },
        token: string
    ): Promise<CommentViewType | null> {
        const userId = await jwtService.verifyAndGetUserIdByToken(token)
        const user = await usersRepository.findUser(userId!)
        if (!user) {
            return user
        }
        const comment: CommentDBType = new CommentDBType(
            new ObjectId(),
            String(Date.now()),
            id,
            body.content,
            { userId: user.id, userLogin: user.accountData.login },
            new Date()
        )
        const commentView = await commentsRepository.createComment(comment, userId)
        return commentView
    },
}

*/
