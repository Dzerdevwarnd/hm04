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
exports.PostsService = void 0;
const inversify_1 = require("inversify");
const jwt_service_1 = require("../application/jwt-service");
const PostsRepository_1 = require("../repositories/PostsRepository");
const postLikesService_1 = require("./postLikesService");
const usersService_1 = require("./usersService");
let PostsService = class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    returnAllPosts(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsDB = yield this.postsRepository.findPostsWithQuery(query);
            const postsView = [];
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
                }; //
                postsView.push(postView);
            }
            const totalCount = yield PostsRepository_1.postModel.countDocuments();
            const pagesCount = Math.ceil(totalCount / query.pageSize);
            const postsPagination = {
                pagesCount: pagesCount || 0,
                page: Number(query.page) || 1,
                pageSize: query.pageSize || 10,
                totalCount: totalCount || 0,
                items: postsView,
            };
            return postsPagination;
        });
    }
    findPost(params, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsRepository.findPost(params);
            if (!foundPost) {
                return null;
            }
            let like = yield postLikesService_1.postLikesService.findPostLikeFromUser(userId, params.id);
            let last3DBLikes = yield postLikesService_1.postLikesService.findLast3Likes(foundPost.id);
            const postView = {
                title: foundPost.title,
                id: foundPost.id,
                content: foundPost.content,
                shortDescription: foundPost.shortDescription,
                blogId: foundPost.blogId,
                blogName: foundPost.blogName,
                createdAt: foundPost.createdAt,
                extendedLikesInfo: {
                    likesCount: foundPost.likesInfo.likesCount,
                    dislikesCount: foundPost.likesInfo.dislikesCount,
                    myStatus: (like === null || like === void 0 ? void 0 : like.likeStatus) || 'None',
                    newestLikes: last3DBLikes || [],
                },
            };
            return postView;
        });
    }
    createPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDate = new Date();
            const newPost = {
                id: String(Date.now()),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: '',
                createdAt: createdDate,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                },
            };
            const postDB = yield this.postsRepository.createPost(newPost);
            const postView = {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: [],
                },
            };
            return postView;
        });
    }
    createPostByBlogId(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDate = new Date();
            const newPost = {
                id: String(Date.now()),
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: id,
                blogName: '',
                createdAt: createdDate,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                },
            };
            const postDB = yield this.postsRepository.createPost(newPost);
            const postView = {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: [],
                },
            };
            return postView;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = this.postsRepository.updatePost(id, body);
            return resultBoolean;
        });
    }
    updatePostLikeStatus(id, body, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(accessToken);
            const post = yield this.findPost({ id }, userId);
            let likesCount = post.extendedLikesInfo.likesCount;
            let dislikesCount = post.extendedLikesInfo.dislikesCount;
            if (body.likeStatus === 'Like' &&
                (post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) !== 'Like') {
                likesCount = +likesCount + 1;
                if ((post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) === 'Dislike') {
                    dislikesCount = +dislikesCount - 1;
                }
                this.postsRepository.updatePostLikesAndDislikesCount(id, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'Dislike' &&
                (post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) !== 'Dislike') {
                dislikesCount = +dislikesCount + 1;
                if ((post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) === 'Like') {
                    likesCount = +likesCount - 1;
                }
                this.postsRepository.updatePostLikesAndDislikesCount(id, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'None' &&
                (post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) === 'Like') {
                likesCount = likesCount - 1;
                this.postsRepository.updatePostLikesAndDislikesCount(id, likesCount, dislikesCount);
            }
            else if (body.likeStatus === 'None' &&
                (post === null || post === void 0 ? void 0 : post.extendedLikesInfo.myStatus) === 'Dislike') {
                dislikesCount = dislikesCount - 1;
                this.postsRepository.updatePostLikesAndDislikesCount(id, likesCount, dislikesCount);
            }
            let like = yield postLikesService_1.postLikesService.findPostLikeFromUser(userId, id);
            const user = yield usersService_1.userService.findUser(userId);
            if (!like) {
                yield postLikesService_1.postLikesService.addLikeToBdFromUser(userId, id, body.likeStatus, user === null || user === void 0 ? void 0 : user.accountData.login);
                return true;
            }
            else {
                if (like.likeStatus === body.likeStatus) {
                    return false;
                }
                postLikesService_1.postLikesService.updateUserLikeStatus(userId, id, body.likeStatus);
                return true;
            }
        });
    }
    deletePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = this.postsRepository.deletePost(params);
            return resultBoolean;
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [PostsRepository_1.PostsRepository])
], PostsService);
