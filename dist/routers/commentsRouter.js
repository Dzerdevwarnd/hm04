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
exports.commentsRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jwt_service_1 = require("../application/jwt-service");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const commentsService_1 = require("../services/commentsService");
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage('Content length should be from 20 to 300');
const likeStatusValidation = (0, express_validator_1.body)('likeStatus')
    .trim()
    .custom((likeStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedValues = ['None', 'Like', 'Dislike'];
    if (!allowedValues.includes(likeStatus)) {
        throw new Error('Incorrect likeStatus Value');
    }
}));
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = undefined;
    if (req.headers.authorization) {
        userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(req.headers.authorization.split(' ')[1]);
    }
    const foundComment = yield commentsService_1.commentService.findComment(req.params.id, userId);
    if (!foundComment) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(foundComment);
        return;
    }
}));
exports.commentsRouter.delete('/:id', authMiddleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsService_1.commentService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if (comment.commentatorInfo.userId !== req.user.id) {
        res.sendStatus(403);
        return;
    }
    const ResultOfDelete = yield commentsService_1.commentService.deleteComment(req.params.id);
    res.sendStatus(204);
    return;
}));
exports.commentsRouter.put('/:id', authMiddleware_1.AuthMiddleware, contentValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsService_1.commentService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if (comment.commentatorInfo.userId !== req.user.id) {
        res.sendStatus(403);
        return;
    }
    const resultOfUpdate = yield commentsService_1.commentService.updateComment(req.params.id, req.body);
    res.sendStatus(204);
    return;
}));
exports.commentsRouter.put('/:id/like-status', authMiddleware_1.AuthMiddleware, likeStatusValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentsService_1.commentService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    const resultOfUpdate = yield commentsService_1.commentService.updateCommentLikeStatus(req.params.id, req.body, req.headers.authorization.split(' ')[1]);
    res.sendStatus(204);
    return;
}));
