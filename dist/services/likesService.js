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
exports.likesService = void 0;
const likesRepository_1 = require("../repositories/likesRepository");
exports.likesService = {
    findCommentLikeFromUser(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield likesRepository_1.likesRepository.findCommentLikeFromUser(userId, commentId);
            return like;
        });
    },
    addLikeToBdFromUser(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = new likesRepository_1.LikeDBType(userId, commentId, likeStatus);
            const result = yield likesRepository_1.likesRepository.addLikeToBdFromUser(like);
            return result;
        });
    },
    updateUserLikeStatus(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = likesRepository_1.likesRepository.updateUserLikeStatus(userId, commentId, likeStatus);
            return result;
        });
    },
};
