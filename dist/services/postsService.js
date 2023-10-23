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
exports.postsService = void 0;
const PostsRepository_1 = require("../repositories/PostsRepository");
exports.postsService = {
    returnAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return PostsRepository_1.postsRepository.returnAllPosts();
        });
    },
    findPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return PostsRepository_1.postsRepository.findPost(params);
        });
    },
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
            };
            const postWithout_id = PostsRepository_1.postsRepository.createPost(newPost);
            return postWithout_id;
        });
    },
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
            };
            const postWithout_id = PostsRepository_1.postsRepository.createPost(newPost);
            return postWithout_id;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = PostsRepository_1.postsRepository.updatePost(id, body);
            return resultBoolean;
        });
    },
    deletePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = PostsRepository_1.postsRepository.deletePost(params);
            return resultBoolean;
        });
    },
};
