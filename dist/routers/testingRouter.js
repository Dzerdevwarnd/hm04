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
exports.testingRouter = void 0;
const express_1 = require("express");
const PostsRepository_1 = require("../repositories/PostsRepository");
const UsersRepository_1 = require("../repositories/UsersRepository");
const blacklistTokensRepository_1 = require("../repositories/blacklistTokensRepository");
const blogsRepository_1 = require("../repositories/blogsRepository");
const commentRepository_1 = require("../repositories/commentRepository");
const ipRequestsRepository_1 = require("../repositories/ipRequestsRepository");
const refreshTokensMetaRepository_1 = require("../repositories/refreshTokensMetaRepository");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resultOfDeleteBlogs = yield blogsRepository_1.blogModel.deleteMany({});
    let resultOfDeletePosts = yield PostsRepository_1.postModel.deleteMany({});
    let resultOfDeleteUsers = yield UsersRepository_1.userModel.deleteMany({});
    let resultOfDeleteComments = yield commentRepository_1.commentModel.deleteMany({});
    let resultOfDeleteBlacklistTokens = yield blacklistTokensRepository_1.BlacklistTokensModel.deleteMany({});
    let resultOfDeleteIpRequests = yield ipRequestsRepository_1.ipRequestModel.deleteMany({});
    let resultOfDeleteRefreshTokenMeta = yield refreshTokensMetaRepository_1.refreshTokensMetaModel.deleteMany({});
    res.sendStatus(204);
    return;
}));
