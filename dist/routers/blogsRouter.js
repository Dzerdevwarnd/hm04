"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const composition_root_1 = require("../compositionRoots/composition-root");
const BlogsController_1 = require("../controllers/BlogsController");
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
const blogsControllerInstance = composition_root_1.appContainer.resolve(BlogsController_1.BlogsController);
exports.blogsRouter.get('/', blogsControllerInstance.getBlogsWithPagination.bind(blogsControllerInstance));
exports.blogsRouter.get('/:id', blogsControllerInstance.getBlogById.bind(blogsControllerInstance));
exports.blogsRouter.get('/:id/posts', blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance));
exports.blogsRouter.post('/', authMiddleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, urlValidation, inputValidationMiddleware_1.inputValidationMiddleware, blogsControllerInstance.postBlog.bind(blogsControllerInstance));
exports.blogsRouter.get('/:id/posts', authMiddleware_1.basicAuthMiddleware, 
//postsValidation.blogIdExistValidationFromUrl,
postsRouter_1.postsValidation.titleValidation, postsRouter_1.postsValidation.shortDescriptionValidation, postsRouter_1.postsValidation.contentValidation, inputValidationMiddleware_1.inputValidationMiddleware, blogsControllerInstance.createPostByBlogId.bind(blogsControllerInstance));
exports.blogsRouter.put('/:id', authMiddleware_1.basicAuthMiddleware, nameValidation, descriptionValidation, urlValidation, inputValidationMiddleware_1.inputValidationMiddleware, blogsControllerInstance.updateBlog.bind(blogsControllerInstance));
exports.blogsRouter.delete('/:id', blogsControllerInstance.deleteBlogByID.bind(blogsControllerInstance));
/*
blogsRouter.get(
    '/',
    async (req: RequestWithQuery<{ query: any }>, res: Response) => {
        const blogsPagination: blogsPaginationType =
            await blogsService.returnAllBlogs(req.query)
        res.status(200).send(blogsPagination)
        return
    }
)

blogsRouter.get(
    '/:id',
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const foundBlog = await blogsService.findBlog(req.params)
        if (!foundBlog) {
            res.sendStatus(404)
            return
        } else {
            res.status(200).send(foundBlog)
            return
        }
    }
)

blogsRouter.get(
    '/:id/posts',
    async (
        req: RequestParamsQuery<{ id: string }, { query: any }>,
        res: Response
    ) => {
        const foundPosts = await blogsService.findPostsByBlogId(
            req.params,
            req.query
        )
        if (foundPosts?.items.length === 0) {
            res.sendStatus(404)
            return
        } else {
            res.status(200).send(foundPosts)
            return
        }
    }
)

blogsRouter.post(
    '/',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithBody<{
            name: string
            description: string
            websiteUrl: string
        }>,
        res: Response
    ) => {
        const newBlog = await blogsService.createBlog(req.body)
        res.status(201).send(newBlog)
        return
    }
)

blogsRouter.post(
    '/:id/posts',
    basicAuthMiddleware,
    //postsValidation.blogIdExistValidationFromUrl,
    postsValidation.titleValidation,
    postsValidation.shortDescriptionValidation,
    postsValidation.contentValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithParamsAndBody<
            { id: string },
            {
                title: string
                shortDescription: string
                content: string
            }
        >,
        res: Response
    ) => {
        if ((await blogsService.findBlog(req.params)) === undefined) {
            res.sendStatus(404)
            return
        }
        const newPost = await postsService.createPostByBlogId(
            req.body,
            req.params.id
        )
        res.status(201).send(newPost)
        return
    }
)

blogsRouter.put(
    '/:id',
    basicAuthMiddleware,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMiddleware,
    async (
        req: RequestWithParamsAndBody<
            { id: string },
            {
                name: string
                description: string
                websiteUrl: string
            }
        >,
        res: Response
    ) => {
        const resultOfUpdateBlog = await blogsService.updateBlog(
            req.params.id,
            req.body
        )
        if (!resultOfUpdateBlog) {
            res.sendStatus(404)
            return
        } else {
            res.sendStatus(204)
            return
        }
    }
)

blogsRouter.delete(
    '/:id',
    basicAuthMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const ResultOfDeleteBlog = await blogsService.deleteBlog(req.params)
        if (!ResultOfDeleteBlog) {
            res.sendStatus(404)
            return
        } else {
            res.sendStatus(204)
            return
        }
    }
)
*/
