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
exports.usersRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middleware/authMiddleware");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const usersService_1 = require("../services/usersService");
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
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersPagination = yield usersService_1.userService.returnAllUsers(req.query);
    res.status(200).send(usersPagination);
}));
exports.usersRouter.post('/', authMiddleware_1.basicAuthMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield usersService_1.userService.createUser(req.body);
    res.status(201).send(newUser);
}));
exports.usersRouter.delete('/:id', authMiddleware_1.basicAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ResultOfDeleteBlog = yield usersService_1.userService.deleteUser(req.params);
    if (!ResultOfDeleteBlog) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
