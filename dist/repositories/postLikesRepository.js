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
exports.postLikesRepository = exports.postLikeModel = exports.postLikeViewType = exports.postLikeDBType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class postLikeDBType {
    constructor(userId, postId, likeStatus, login = 'string') {
        this.userId = userId;
        this.postId = postId;
        this.likeStatus = likeStatus;
        this.login = login;
        this.addedAt = new Date();
    }
}
exports.postLikeDBType = postLikeDBType;
class postLikeViewType {
    constructor(userId, login = 'string') {
        this.userId = userId;
        this.login = login;
        this.addedAt = new Date();
    }
}
exports.postLikeViewType = postLikeViewType;
const postLikeSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    likeStatus: { type: String, required: true },
    login: { type: String, required: true, default: 'string' },
    addedAt: { type: Date, required: true },
});
exports.postLikeModel = mongoose_1.default.model('postsLikes', postLikeSchema);
exports.postLikesRepository = {
    findPostLikeFromUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield exports.postLikeModel.findOne({
                userId: userId,
                postId: postId,
            });
            return like;
        });
    },
    findLast3Likes(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const last3Likes = yield exports.postLikeModel
                .find({ postId: postId, likeStatus: 'Like' }, {
                addedAt: 1,
                userId: 1,
                login: 1,
                _id: 0,
            })
                .sort({ addedAt: -1 })
                .limit(3)
                .lean();
            return last3Likes;
        });
    },
    addLikeToBdFromUser(like) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.postLikeModel.insertMany(like);
            return result.length == 1;
        });
    },
    updateUserLikeStatus(userId, postId, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.postLikeModel.updateOne({ userId: userId, postId: postId }, { likeStatus: likeStatus });
            return result.modifiedCount == 1;
        });
    },
};
