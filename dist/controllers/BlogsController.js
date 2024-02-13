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
exports.BlogsController = void 0;
const inversify_1 = require("inversify");
const jwt_service_1 = require("../application/jwt-service");
const blogsService_1 = require("../services/blogsService");
const postsService_1 = require("../services/postsService");
let BlogsController = class BlogsController {
    constructor(blogsService, postsService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
    }
    getBlogsWithPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogsPagination = yield this.blogsService.returnAllBlogs(req.query);
            res.status(200).send(blogsPagination);
            return;
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield this.blogsService.findBlog(req.params);
            if (!foundBlog) {
                res.sendStatus(404);
                return;
            }
            else {
                res.status(200).send(foundBlog);
                return;
            }
        });
    }
    getPostsByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = undefined;
            if (req.headers.authorization) {
                userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(req.headers.authorization.split(' ')[1]);
            }
            const foundPosts = yield this.blogsService.findPostsByBlogId(req.params, req.query, userId);
            if ((foundPosts === null || foundPosts === void 0 ? void 0 : foundPosts.items.length) === 0) {
                res.sendStatus(404);
                return;
            }
            else {
                res.status(200).send(foundPosts);
                return;
            }
        });
    }
    postBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield this.blogsService.createBlog(req.body);
            res.status(201).send(newBlog);
            return;
        });
    }
    createPostByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.blogsService.findBlog(req.params)) === undefined) {
                res.sendStatus(404);
                return;
            }
            const newPost = yield this.postsService.createPostByBlogId(req.body, req.params.id);
            res.status(201).send(newPost);
            return;
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdateBlog = yield this.blogsService.updateBlog(req.params.id, req.body);
            if (!resultOfUpdateBlog) {
                res.sendStatus(404);
                return;
            }
            else {
                res.sendStatus(204);
                return;
            }
        });
    }
    deleteBlogByID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ResultOfDeleteBlog = yield this.blogsService.deleteBlog(req.params);
            if (!ResultOfDeleteBlog) {
                res.sendStatus(404);
                return;
            }
            else {
                res.sendStatus(204);
                return;
            }
        });
    }
};
exports.BlogsController = BlogsController;
exports.BlogsController = BlogsController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogsService_1.BlogsService,
        postsService_1.PostsService])
], BlogsController);
