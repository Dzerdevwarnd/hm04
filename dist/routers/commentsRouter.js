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
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const commentRepository_1 = require("../repositories/commentRepository");
const commentsService_1 = require("../services/commentsService");
const loginValidation = (0, express_validator_1.body)('login')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Login length should be from 3 to 10');
const passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password length should be from 6 to 20');
const emailValidation = (0, express_validator_1.body)('email')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('URL length should be from 1 to 100')
    .isEmail()
    .withMessage('Invalid email');
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Content length should be from 1 to 100');
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundComment = yield commentsService_1.commentService.findComment(req.params.id);
    if (!foundComment) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(foundComment);
    }
}));
exports.commentsRouter.delete('/:id', authMiddleware_1.AuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentRepository_1.commentsRepository.findComment(req.params.id);
    if ((comment === null || comment === void 0 ? void 0 : comment.id) !== req.user.id) {
        res.sendStatus(403);
        return;
    }
    const ResultOfDelete = yield commentsService_1.commentService.deleteComment(req.params.id);
    if (!ResultOfDelete) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
exports.commentsRouter.put('/:id', authMiddleware_1.AuthMiddleware, contentValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield commentRepository_1.commentsRepository.findComment(req.params.id);
    if ((comment === null || comment === void 0 ? void 0 : comment.id) !== req.user.id) {
        res.sendStatus(403);
        return;
    }
    const resultOfUpdate = yield commentsService_1.commentService.updateComment(req.params.id, req.body);
    if (!resultOfUpdate) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
