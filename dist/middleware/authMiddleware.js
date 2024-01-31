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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = exports.AuthMiddleware = void 0;
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const jwt_service_1 = require("../application/jwt-service");
const usersService_1 = require("../services/usersService");
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(token);
    if (userId) {
        req.user = yield usersService_1.userService.findUser(userId);
        next();
    }
    else {
        res.sendStatus(401);
    }
});
exports.AuthMiddleware = AuthMiddleware;
const basicAuthMiddleware = (req, res, next) => {
    (0, express_basic_auth_1.default)({
        users: { admin: 'qwerty' },
        unauthorizedResponse: 'Unauthorized',
    })(req, res, next);
};
exports.basicAuthMiddleware = basicAuthMiddleware;
