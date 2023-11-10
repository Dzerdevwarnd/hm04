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
const jwt_service_1 = require("../application/jwt-service");
const UsersRepository_1 = require("../repositories/UsersRepository");
const commentRepository_1 = require("../repositories/commentRepository");
exports.commentService = {
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let comment = yield commentRepository_1.commentsRepository.findComment(id);
            return comment;
        });
    },
    findCommentsByPostId(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let commentsPagination = yield commentRepository_1.commentsRepository.findCommentsByPostId(id, query);
            return commentsPagination;
        });
    },
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield commentRepository_1.commentsRepository.deleteComment(commentId);
            return result;
        });
    },
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield commentRepository_1.commentsRepository.updateComment(id, body);
            return result;
        });
    },
    createCommentsByPostId(id, body, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
            const user = yield UsersRepository_1.usersRepository.findUser(userId);
            if (!user) {
                return user;
            }
            const comment = {
                id: String(Date.now()),
                content: body.content,
                commentatorInfo: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    userLogin: user === null || user === void 0 ? void 0 : user.login,
                },
                createdAt: new Date(),
            };
            const newCommentWithout_id = yield commentRepository_1.commentsRepository.createComment(comment);
            return newCommentWithout_id;
        });
    },
};
