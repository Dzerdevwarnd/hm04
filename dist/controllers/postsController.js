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
exports.PostsController = void 0;
const inversify_1 = require("inversify");
const jwt_service_1 = require("../application/jwt-service");
const commentsService_1 = require("../services/commentsService");
const postsService_1 = require("../services/postsService");
let PostsController = class PostsController {
    constructor(postsService, commentService) {
        this.postsService = postsService;
        this.commentService = commentService;
    }
    getPostsWithPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield this.postsService.returnAllPosts(req.query);
            res.status(200).send(allPosts);
            return;
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsService.findPost(req.params);
            if (!foundPost) {
                res.sendStatus(404);
                return;
            }
            else {
                res.status(200).send(foundPost);
                return;
            }
        });
    }
    postPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = yield this.postsService.createPost(req.body);
            res.status(201).send(newPost);
            return;
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ResultOfUpdatePost = yield this.postsService.updatePost(req.params.id, req.body);
            if (!ResultOfUpdatePost) {
                res.sendStatus(404);
                return;
            }
            else {
                res.sendStatus(204);
                return;
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfDelete = yield this.postsService.deletePost(req.params);
            if (!resultOfDelete) {
                res.sendStatus(404);
                return;
            }
            else {
                res.sendStatus(204);
                return;
            }
        });
    }
    getCommentsByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = undefined;
            if (req.headers.authorization) {
                userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(req.headers.authorization.split(' ')[1]);
            }
            const commentsPagination = yield this.commentService.findCommentsByPostId(req.params.id, req.query, userId);
            if ((commentsPagination === null || commentsPagination === void 0 ? void 0 : commentsPagination.items.length) === 0) {
                res.sendStatus(404);
                return;
            }
            else {
                res.status(200).send(commentsPagination);
                return;
            }
        });
    }
    postCommentByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            {
                const post = yield this.postsService.findPost(req.params);
                if (!post) {
                    res.sendStatus(404);
                    return;
                }
                const token = req.headers.authorization.split(' ')[1];
                const comment = yield this.commentService.createCommentsByPostId(req.params.id, req.body, token);
                if (!comment) {
                    res.sendStatus(404);
                    return;
                }
                else {
                    res.status(201).send(comment);
                    return;
                }
            }
        });
    }
};
exports.PostsController = PostsController;
exports.PostsController = PostsController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [postsService_1.PostsService,
        commentsService_1.CommentsService])
], PostsController);
