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
exports.blogsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const blogsService_1 = require("../services/blogsService");
const postsService_1 = require("../services/postsService");
const postsRouter_1 = require("./postsRouter");
const nameValidation = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage('Name length should be from 1 to 15');
const descriptionValidation = (0, express_validator_1.body)('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description length should be from 1 to 500');
const urlValidation = (0, express_validator_1.body)('websiteUrl')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('URL length should be from 1 to 101')
    .isURL()
    .withMessage('Invalid URl');
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogsPagination = yield blogsService_1.blogsService.returnAllBlogs(req.query);
    res.status(200).send(blogsPagination);
    return;
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlog = yield blogsService_1.blogsService.findBlog(req.params);
    if (!foundBlog) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(foundBlog);
        return;
    }
}));
exports.blogsRouter.get('/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPosts = yield blogsService_1.blogsService.findPostsByBlogId(req.params, req.query);
    if ((foundPosts === null || foundPosts === void 0 ? void 0 : foundPosts.items.length) === 0) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(foundPosts);
        return;
    }
}));
exports.blogsRouter.post('/', authMiddleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, urlValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blogsService_1.blogsService.createBlog(req.body);
    res.status(201).send(newBlog);
    return;
}));
exports.blogsRouter.post('/:id/posts', authMiddleware_1.basicAuthMiddleware, 
//postsValidation.blogIdExistValidationFromUrl,
postsRouter_1.postsValidation.titleValidation, postsRouter_1.postsValidation.shortDescriptionValidation, postsRouter_1.postsValidation.contentValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield blogsService_1.blogsService.findBlog(req.params)) === undefined) {
        res.sendStatus(404);
        return;
    }
    const newPost = yield postsService_1.postsService.createPostByBlogId(req.body, req.params.id);
    res.status(201).send(newPost);
    return;
}));
exports.blogsRouter.put('/:id', authMiddleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, urlValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultOfUpdateBlog = yield blogsService_1.blogsService.updateBlog(req.params.id, req.body);
    if (!resultOfUpdateBlog) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
exports.blogsRouter.delete('/:id', authMiddleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ResultOfDeleteBlog = yield blogsService_1.blogsService.deleteBlog(req.params);
    if (!ResultOfDeleteBlog) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
