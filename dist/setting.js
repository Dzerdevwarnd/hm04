"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routersPaths = exports.settings = exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const authRouter_1 = require("./routers/authRouter");
const blogsRouter_1 = require("./routers/blogsRouter");
const commentsRouter_1 = require("./routers/commentsRouter");
const postsRouter_1 = require("./routers/postsRouter");
const securityRouter_1 = require("./routers/securityRouter");
const testingRouter_1 = require("./routers/testingRouter");
const usersRouter_1 = require("./routers/usersRouter");
exports.app = (0, express_1.default)();
exports.settings = {
    MONGO_URL: process.env.MONGO_URL ||
        'mongodb+srv://admin:qwerty123@cluster0.hzh4nyr.mongodb.net/?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    accessTokenLifeTime: '10000ms',
    refreshTokenLifeTime: '20000ms',
};
exports.routersPaths = {
    auth: '/auth',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    testing: '/testing',
    comments: '/comments',
    security: '/security',
};
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.set('trust proxy', true);
exports.app.use(exports.routersPaths.auth, authRouter_1.authRouter);
exports.app.use(exports.routersPaths.blogs, blogsRouter_1.blogsRouter);
exports.app.use(exports.routersPaths.posts, postsRouter_1.postsRouter);
exports.app.use(exports.routersPaths.users, usersRouter_1.usersRouter);
exports.app.use(exports.routersPaths.testing, testingRouter_1.testingRouter);
exports.app.use(exports.routersPaths.comments, commentsRouter_1.commentsRouter);
exports.app.use(exports.routersPaths.security, securityRouter_1.securityRouter);
