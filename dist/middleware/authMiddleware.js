"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const basicAuthMiddleware = (req, res, next) => {
    (0, express_basic_auth_1.default)({
        users: { admin: 'qwerty' },
        unauthorizedResponse: 'Unauthorized',
    })(req, res, next);
};
exports.basicAuthMiddleware = basicAuthMiddleware;
