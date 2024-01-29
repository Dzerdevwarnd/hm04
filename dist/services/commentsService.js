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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = void 0;
const mongodb_1 = require("mongodb");
const jwt_service_1 = require("../application/jwt-service");
const UsersRepository_1 = require("../repositories/UsersRepository");
const commentRepository_1 = require("../repositories/commentRepository");
const commentRepository_2 = require("../repositories/commentRepository");
const likesService_1 = require("./likesService");
exports.commentService = {
    findComment(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield likesService_1.likesService.findCommentLikeFromUser(userId, commentId);
            const userLikeStatus = (like === null || like === void 0 ? void 0 : like.likeStatus) || 'None';
            let comment = yield commentRepository_2.commentsRepository.findComment(commentId, userLikeStatus);
            return comment;
        });
    },
    findCommentsByPostId(postId, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentsDB = yield commentRepository_2.commentsRepository.findDBCommentsByPostIdWithoutLikeStatus(postId, query);
            if (!commentsDB) {
                return null;
            }
            const commentsView = [];
            for (const comment of commentsDB) {
                let like = yield likesService_1.likesService.findCommentLikeFromUser(userId, comment.id);
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
    },
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield commentRepository_2.commentsRepository.deleteComment(commentId);
            return result;
        });
    },
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield commentRepository_2.commentsRepository.updateComment(id, body);
            return result;
        });
    },
    updateCommentLikeStatus(commentId, body, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(accessToken);
            const comment = yield exports.commentService.findComment(commentId, userId);
            let likesCount = comment.likesInfo.likesCount;
            let dislikesCount = comment.likesInfo.dislikesCount;
            if (body.likeStatus === 'Like' && (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) !== 'Like') {
                likesCount = (+likesCount + 1).toString();
                commentRepository_2.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount.toString(), dislikesCount.toString());
            }
            else if (body.likeStatus === 'Dislike' &&
                (comment === null || comment === void 0 ? void 0 : comment.likesInfo.myStatus) !== 'DisLike') {
                dislikesCount = (+dislikesCount + 1).toString();
                commentRepository_2.commentsRepository.updateCommentLikesAndDislikesCount(commentId, likesCount.toString(), dislikesCount.toString());
            }
            let like = yield likesService_1.likesService.findCommentLikeFromUser(userId, commentId);
            if (!like) {
                yield likesService_1.likesService.addLikeToBdFromUser(userId, commentId, body.likeStatus);
                return true;
            }
            else {
                if (like.likeStatus === body.likeStatus) {
                    return false;
                }
                likesService_1.likesService.updateUserLikeStatus(userId, commentId, body.likeStatus);
                return true;
            }
        });
    },
    createCommentsByPostId(id, body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(token);
            const user = yield UsersRepository_1.usersRepository.findUser(userId);
            if (!user) {
                return user;
            }
            const comment = new commentRepository_1.CommentDBType(new mongodb_1.ObjectId(), String(Date.now()), id, body.content, { userId: user.id, userLogin: user.accountData.login }, new Date());
            const commentView = yield commentRepository_2.commentsRepository.createComment(comment, userId);
            return commentView;
        });
    },
};
