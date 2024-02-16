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
exports.PostsRepository = exports.postModel = exports.postViewType = exports.postDBType = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = __importDefault(require("mongoose"));
const postLikesService_1 = require("../services/postLikesService");
class postDBType {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.likesInfo = {
            likesCount: 0,
            dislikesCount: 0,
        };
    }
}
exports.postDBType = postDBType;
class postViewType {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: [],
        };
    }
}
exports.postViewType = postViewType;
const postSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, default: '' },
    createdAt: { type: Date, required: true },
    likesInfo: {
        type: {
            likesCount: { type: Number, required: true, default: 0 },
            dislikesCount: { type: Number, required: true, default: 0 },
        },
        required: true,
    },
});
exports.postModel = mongoose_1.default.model('posts', postSchema);
let PostsRepository = class PostsRepository {
    findPostsWithQuery(query) {
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
            const posts = yield exports.postModel
                .find({}, '-_id -__v')
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
                .limit(pageSize)
                .lean();
            const totalCount = yield exports.postModel.countDocuments();
            return posts;
        });
    }
    findPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield exports.postModel.findOne({ id: params.id });
            return post;
        });
    }
    findPostsByBlogId(params, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalCount = yield exports.postModel.countDocuments({
                blogId: params.id,
            });
            const pageSize = Number(query.pageSize) || 10;
            const page = Number(query.pageNumber) || 1;
            const sortBy = query.sortBy || 'createdAt';
            let sortDirection = query.sortDirection || 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            let postsDB = yield exports.postModel
                .find({ blogId: params.id }, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .lean();
            let postsView = [];
            for (const post of postsDB) {
                let like = yield postLikesService_1.postLikesService.findPostLikeFromUser(userId, post.id);
                let last3DBLikes = yield postLikesService_1.postLikesService.findLast3Likes(post.id);
                let postView = {
                    title: post.title,
                    id: post.id,
                    content: post.content,
                    shortDescription: post.shortDescription,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: post.likesInfo.likesCount,
                        dislikesCount: post.likesInfo.dislikesCount,
                        myStatus: (like === null || like === void 0 ? void 0 : like.likeStatus) || 'None',
                        newestLikes: last3DBLikes || [],
                    },
                };
                postsView.push(postView);
            }
            const pageCount = Math.ceil(totalCount / pageSize);
            const postsPagination = {
                pagesCount: pageCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: postsView,
            };
            if (postsView) {
                return postsPagination;
            }
            else {
                return;
            }
        });
    }
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.postModel.insertMany(newPost);
            return result.length == 1;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.postModel.updateOne({ id: id }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                },
            });
            return result.matchedCount === 1;
        });
    }
    updatePostLikesAndDislikesCount(postId, likesCount, dislikesCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield exports.postModel.updateOne({ id: postId }, {
                $set: {
                    'likesInfo.likesCount': likesCount,
                    'likesInfo.dislikesCount': dislikesCount,
                },
            });
            return resultOfUpdate.matchedCount === 1;
        });
    }
    deletePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield exports.postModel.deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    }
};
exports.PostsRepository = PostsRepository;
exports.PostsRepository = PostsRepository = __decorate([
    (0, inversify_1.injectable)()
], PostsRepository);
