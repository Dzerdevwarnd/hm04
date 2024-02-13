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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentLikesRepository = exports.commentLikeModel = exports.commentLikeDBType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class commentLikeDBType {
    constructor(userId, commentId, likeStatus) {
        this.userId = userId;
        this.commentId = commentId;
        this.likeStatus = likeStatus;
    }
}
exports.commentLikeDBType = commentLikeDBType;
const commentLikeSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    likeStatus: { type: String, required: true },
});
exports.commentLikeModel = mongoose_1.default.model('commentsLikes', commentLikeSchema);
exports.commentLikesRepository = {
    findCommentLikeFromUser(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield exports.commentLikeModel.findOne({
                userId: userId,
                commentId: commentId,
            });
            return like;
        });
    },
    addLikeToBdFromUser(like) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.commentLikeModel.insertMany(like);
            return result.length == 1;
        });
    },
    updateUserLikeStatus(userId, commentId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.commentLikeModel.updateOne({ userId: userId, commentId: commentId }, { likeStatus: likeStatus });
            return result.modifiedCount == 1;
        });
    },
};
