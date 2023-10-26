"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogsRouter_1 = require("./routers/blogsRouter");
const postsRouter_1 = require("./routers/postsRouter");
const testingRouter_1 = require("./routers/testingRouter");
const usersRouter_1 = require("./routers/usersRouter");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/blogs', blogsRouter_1.blogsRouter);
exports.app.use('/posts', postsRouter_1.postsRouter);
exports.app.use('/users', usersRouter_1.usersRouter);
exports.app.use('/testing', testingRouter_1.testingRouter);
