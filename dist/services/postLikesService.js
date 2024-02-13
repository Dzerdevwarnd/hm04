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
exports.postLikesService = void 0;
const postLikesRepository_1 = require("../repositories/postLikesRepository");
exports.postLikesService = {
    findPostLikeFromUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield postLikesRepository_1.postLikesRepository.findPostLikeFromUser(userId, postId);
            return like;
        });
    },
    findLast3Likes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const last3Likes = yield postLikesRepository_1.postLikesRepository.findLast3Likes(postId);
            return last3Likes;
        });
    },
    addLikeToBdFromUser(userId, postId, likeStatus, login) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = new postLikesRepository_1.postLikeDBType(userId, postId, likeStatus, login);
            const result = yield postLikesRepository_1.postLikesRepository.addLikeToBdFromUser(like);
            return result;
        });
    },
    updateUserLikeStatus(userId, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = postLikesRepository_1.postLikesRepository.updateUserLikeStatus(userId, postId, likeStatus);
            return result;
        });
    },
};
