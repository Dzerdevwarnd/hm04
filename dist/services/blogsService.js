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
exports.BlogsService = void 0;
const inversify_1 = require("inversify");
const blogsRepository_1 = require("../repositories/blogsRepository");
const PostsRepository_1 = require("../repositories/PostsRepository");
let BlogsService = class BlogsService {
    constructor(blogsRepository, postsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
    }
    returnAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.returnAllBlogs(query);
        });
    }
    findBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.findBlog(params);
        });
    }
    findPostsByBlogId(params, query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postsRepository.findPostsByBlogId(params, query, userId);
        });
    }
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDate = new Date();
            const newBlog = {
                id: String(Date.now()),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: createdDate,
                isMembership: false,
            };
            const newBlogWithout_id = this.blogsRepository.createBlog(newBlog);
            return newBlogWithout_id;
        });
    }
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = this.blogsRepository.updateBlog(id, body);
            return resultBoolean;
        });
    }
    deleteBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultBoolean = this.blogsRepository.deleteBlog(params);
            return resultBoolean;
        });
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogsRepository_1.BlogsRepository,
        PostsRepository_1.PostsRepository])
], BlogsService);
