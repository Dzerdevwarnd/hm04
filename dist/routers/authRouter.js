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
const emailAdapter_1 = require("../adapters/emailAdapter");
const jwt_service_1 = require("../application/jwt-service");
const inputValidationMiddleware_1 = require("../middleware/inputValidationMiddleware");
const UsersRepository_1 = require("../repositories/UsersRepository");
const authService_1 = require("../services/authService");
const usersService_1 = require("../services/usersService");
exports.authRouter = (0, express_1.Router)({});
const loginValidation = (0, express_validator_1.body)('login')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('login length should be from 3 to 10')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UsersRepository_1.usersRepository.findDBUser(login);
    if (user) {
        throw new Error('User with that login is already exist');
    }
}));
const EmailFormValidation = (0, express_validator_1.body)('email')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Email length should be from 1 to 100')
    .isEmail()
    .withMessage('Incorrect email');
const EmailUsageValidation = (0, express_validator_1.body)('email').custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UsersRepository_1.usersRepository.findDBUser(email);
    if (user) {
        throw new Error('User with that email is already exist');
    }
}));
const loginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('login or Email length should be from 1 to 100');
const passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Password or Email length should be from 6 to 20');
const confirmationCodeValidation = (0, express_validator_1.body)('code').custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersService_1.userService.findDBUserByConfirmationCode(code);
    if (!user) {
        throw new Error('Invalid Code');
    }
}));
const confirmationCodeIsAlreadyConfirmedValidation = (0, express_validator_1.body)('code').custom((code) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersService_1.userService.findDBUserByConfirmationCode(code);
    if ((user === null || user === void 0 ? void 0 : user.emailConfirmationData.isConfirmed) === true) {
        throw new Error('Code is already confirmed');
    }
}));
const emailExistValidation = (0, express_validator_1.body)('email').custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UsersRepository_1.usersRepository.findDBUser(email);
    if (!user) {
        throw new Error('User with this email not exist');
    }
}));
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
        login: user.accountData.login,
        email: user.accountData.email,
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
exports.authRouter.post('/registration', EmailFormValidation, EmailUsageValidation, loginValidation, passwordValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield authService_1.authService.createUser(req.body.password, req.body.email, req.body.login);
    if (!newUser) {
        res.status(400).send('User create error');
        return;
    }
    yield emailAdapter_1.emailAdapter.sendConfirmEmail(req.body.email);
    res.sendStatus(204);
    return;
}));
exports.authRouter.post('/registration-confirmation', confirmationCodeIsAlreadyConfirmedValidation, confirmationCodeValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfirmationAccept = yield usersService_1.userService.userEmailConfirmationAccept(req.body.code);
    if (!isConfirmationAccept) {
        res.status(400).send('user confirm error');
        return;
    }
    else {
        res.sendStatus(204);
        return;
    }
}));
exports.authRouter.post('/registration-email-resending', EmailFormValidation, emailExistValidation, confirmationCodeIsAlreadyConfirmedValidation, inputValidationMiddleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield UsersRepository_1.usersRepository.userConfirmationCodeUpdate(req.body.email);
    yield emailAdapter_1.emailAdapter.sendConfirmEmail(req.body.email);
    res.sendStatus(204);
    return;
}));
/////
