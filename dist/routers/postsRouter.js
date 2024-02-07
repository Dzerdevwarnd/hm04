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
exports.postsRouter = exports.postsValidation = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../compositionRoots/composition-root");
const postsController_1 = require("../controllers/postsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const blogsRepository_1 = require("../repositories/blogsRepository");
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
        const blog = yield blogsRepository_1.blogModel.findOne(params);
        if (!blog) {
            throw new Error('Blog id does not exist');
        }
    })),
    commentsContentValidation: (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 20, max: 300 })
        .withMessage('Content length should be from 20 to 300'),
};
const postsControllerInstance = composition_root_1.appContainer.resolve(postsController_1.PostsController);
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', postsControllerInstance.getPostsWithPagination.bind(postsControllerInstance));
exports.postsRouter.get('/:id', postsControllerInstance.getPostById.bind(postsControllerInstance));
exports.postsRouter.post('/', authMiddleware_1.basicAuthMiddleware, exports.postsValidation.blogIdExistValidationFromBody, exports.postsValidation.titleValidation, exports.postsValidation.shortDescriptionValidation, exports.postsValidation.contentValidation, exports.postsValidation.blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, postsControllerInstance.postPost.bind(postsControllerInstance));
exports.postsRouter.put('/:id', authMiddleware_1.basicAuthMiddleware, exports.postsValidation.blogIdExistValidationFromBody, exports.postsValidation.titleValidation, exports.postsValidation.shortDescriptionValidation, exports.postsValidation.contentValidation, exports.postsValidation.blogIdValidation, inputValidationMiddleware_1.inputValidationMiddleware, postsControllerInstance.updatePost.bind(postsControllerInstance));
exports.postsRouter.delete('/:id', postsControllerInstance.deleteById.bind(postsControllerInstance));
exports.postsRouter.get('/:id/comments', postsControllerInstance.getCommentsByPostId.bind(postsControllerInstance));
exports.postsRouter.post('/:id/comments', authMiddleware_1.AuthMiddleware, exports.postsValidation.commentsContentValidation, inputValidationMiddleware_1.inputValidationMiddleware, postsControllerInstance.postCommentByPostId.bind(postsControllerInstance));
/*postsRouter.get(
    '/',
    async (req: RequestWithQuery<{ query: any }>, res: Response) => {
        const allPosts: postsByBlogIdPaginationType =
            await postsService.returnAllPosts(req.query)
        res.status(200).send(allPosts)
        return
    }
)

postsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const foundPost = await postsService.findPost(req.params)
        if (!foundPost) {
            res.sendStatus(404)
            return
        } else {
            res.status(200).send(foundPost)
            return
        }
    }
)

postsRouter.post(
    '/',
    basicAuthMiddleware,
    postsValidation.blogIdExistValidationFromBody,
    postsValidation.titleValidation,
    postsValidation.shortDescriptionValidation,
    postsValidation.contentValidation,
    postsValidation.blogIdValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithBody<{
            title: string
            shortDescription: string
            content: string
            blogId: string
        }>,
        res: Response
    ) => {
        const newPost = await postsService.createPost(req.body)
        res.status(201).send(newPost)
        return
    }
)

postsRouter.put(
    '/:id',
    basicAuthMiddleware,
    postsValidation.blogIdExistValidationFromBody,
    postsValidation.titleValidation,
    postsValidation.shortDescriptionValidation,
    postsValidation.contentValidation,
    postsValidation.blogIdValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithParamsAndBody<
            { id: string },
            {
                title: string
                shortDescription: string
                content: string
                blogId: string
            }
        >,
        res: Response
    ) => {
        const ResultOfUpdatePost = await postsService.updatePost(
            req.params.id,
            req.body
        )
        if (!ResultOfUpdatePost) {
            res.sendStatus(404)
            return
        } else {
            res.sendStatus(204)
            return
        }
    }
)

postsRouter.delete(
    '/:id',
    basicAuthMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const resultOfDelete = await postsService.deletePost(req.params)
        if (!resultOfDelete) {
            res.sendStatus(404)
            return
        } else {
            res.sendStatus(204)
            return
        }
    }
)

postsRouter.get(
    '/:id/comments',
    async (
        req: RequestWithParamsAndQuery<{ id: string }, { query: any }>,
        res: Response
    ) => {
        let userId = undefined
        if (req.headers.authorization) {
            userId = await jwtService.verifyAndGetUserIdByToken(
                req.headers.authorization.split(' ')[1]
            )
        }
        const commentsPagination =
            await commentsServiceInstance.findCommentsByPostId(
                req.params.id,
                req.query,
                userId
            )
        if (commentsPagination?.items.length === 0) {
            res.sendStatus(404)
            return
        } else {
            res.status(200).send(commentsPagination)
            return
        }
    }
)

postsRouter.post(
    '/:id/comments',
    AuthMiddleware,
    postsValidation.commentsContentValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithParamsAndBody<{ id: string }, { content: string }>,
        res: Response
    ) => {
        const post = await postsRepository.findPost(req.params)
        if (!post) {
            res.sendStatus(404)
            return
        }
        const token = req.headers.authorization!.split(' ')[1]

        const comment = await commentsServiceInstance.createCommentsByPostId(
            req.params.id,
            req.body,
            token
        )
        if (!comment) {
            res.sendStatus(404)
            return
        } else {
            res.status(201).send(comment)
            return
        }
    }
)
*/
