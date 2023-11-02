"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routersPaths = exports.settings = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const authRouter_1 = require("./routers/authRouter");
const blogsRouter_1 = require("./routers/blogsRouter");
const postsRouter_1 = require("./routers/postsRouter");
const testingRouter_1 = require("./routers/testingRouter");
const usersRouter_1 = require("./routers/usersRouter");
exports.app = (0, express_1.default)();
exports.settings = {
    MONGO_URL: process.env.MONGO_URL ||
        'mongodb+srv://admin:qwerty123@cluster0.hzh4nyr.mongodb.net/?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || '123',
};
exports.routersPaths = {
    auth: '/auth',
    blogs: '/blogs',
    posts: '/posts',
    users: '/users',
    testing: '/testing',
};
exports.app.use(express_1.default.json());
exports.app.use(exports.routersPaths.auth, authRouter_1.authRouter);
exports.app.use(exports.routersPaths.blogs, blogsRouter_1.blogsRouter);
exports.app.use(exports.routersPaths.posts, postsRouter_1.postsRouter);
exports.app.use(exports.routersPaths.users, usersRouter_1.usersRouter);
exports.app.use(exports.routersPaths.testing, testingRouter_1.testingRouter);
