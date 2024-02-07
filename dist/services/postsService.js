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
const PostsRepository_1 = require("../repositories/PostsRepository");
let PostsService = class PostsService {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    returnAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.returnAllPosts(query);
        });
    }
    findPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.findPost(params);
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
            };
            const postWithout_id = this.postsRepository.createPost(newPost);
            return postWithout_id;
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
            };
            const postWithout_id = this.postsRepository.createPost(newPost);
            return postWithout_id;
        });
    }
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = this.postsRepository.updatePost(id, body);
            return resultBoolean;
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
