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
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jwt_service_1 = require("../application/jwt-service");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const authService_1 = require("../services/authService");
const usersService_1 = require("../services/usersService");
exports.authRouter = (0, express_1.Router)({});
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('login or Email length should be from 1 to 100');
const passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Password or Email length should be from 1 to 20');
exports.authRouter.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    if (!userId) {
        res.sendStatus(401);
        return;
    }
    const user = yield usersService_1.userService.findUser(userId);
    const userInfo = {
        id: userId,
        login: user.login,
        email: user.email,
    };
    res.status(200).send(userInfo);
    return;
}));
exports.authRouter.post('/login', loginOrEmailValidation, passwordValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield authService_1.authService.loginAndReturnJwtKey(req.body.loginOrEmail, req.body.password);
    if (!accessToken) {
        res.sendStatus(401);
        return;
    }
    else {
        res.status(200).send(accessToken);
        return;
    }
}));
////
