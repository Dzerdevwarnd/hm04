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
exports.postsValidation = exports.postsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const blogsService_1 = require("../services/blogsService");
const postsService_1 = require("../services/postsService");
exports.postsRouter = (0, express_1.Router)({});
exports.postsValidation = {
    titleValidation: (0, express_validator_1.body)('title')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('title length should be from 1 to 30'),
    shortDescriptionValidation: (0, express_validator_1.body)('shortDescription')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('shortDescription length should be from 1 to 100'),
    contentValidation: (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Content length should be from 1 to 1000'),
    blogIdValidation: (0, express_validator_1.body)('blogId')
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('blogId length should be from 1 to 100'),
    blogIdExistValidationFromBody: (0, express_validator_1.body)('blogId').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        const id = value;
        const params = { id };
        const blog = yield blogsService_1.blogsService.findBlog(params);
        if (!blog) {
            throw new Error('Blog id does not exist');
        }
    })),
    /*blogIdExistValidationFromUrl: param('id').custom(
        async (value: string, { req }) => {
            const id = value
            const params = { id }
            const blog: blogType | undefined = await blogsService.findBlog(params)
            if (!blog) {
                const error = new Error('Blog URL id does not exist')
                throw error
            }
        }
    ),*/
};
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield postsService_1.postsService.returnAllPosts(req.query);
    res.status(200).send(allPosts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield postsService_1.postsService.findPost(req.params);
    if (!foundPost) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(foundPost);
    }
}));
exports.postsRouter.post('/', authMiddleware_1.basicAuthMiddleware, exports.postsValidation.blogIdExistValidationFromBody, exports.postsValidation.titleValidation, exports.postsValidation.shortDescriptionValidation, exports.postsValidation.contentValidation, exports.postsValidation.blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield postsService_1.postsService.createPost(req.body);
    res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authMiddleware_1.basicAuthMiddleware, exports.postsValidation.blogIdExistValidationFromBody, exports.postsValidation.titleValidation, exports.postsValidation.shortDescriptionValidation, exports.postsValidation.contentValidation, exports.postsValidation.blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ResultOfUpdatePost = yield postsService_1.postsService.updatePost(req.params.id, req.body);
    if (!ResultOfUpdatePost) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
exports.postsRouter.delete('/:id', authMiddleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultOfDelete = yield postsService_1.postsService.deletePost(req.params);
    if (!resultOfDelete) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
