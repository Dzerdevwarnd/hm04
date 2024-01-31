"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsControllerInstance = void 0;
const commentRepository_1 = require("./repositories/commentRepository");
const commentsRouter_1 = require("./routers/commentsRouter");
const commentsService_1 = require("./services/commentsService");
const commentsRepository = new commentRepository_1.CommentsRepository();
const commentsService = new commentsService_1.CommentsService(commentsRepository);
exports.commentsControllerInstance = new commentsRouter_1.CommentsController(commentsService);
