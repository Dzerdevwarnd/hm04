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
exports.authService = void 0;
const jwt_service_1 = require("../application/jwt-service");
const usersService_1 = require("../services/usersService");
exports.authService = {
    loginAndReturnJwtKey(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersService_1.userService.checkCredentionalsAndReturnUser(loginOrEmail, password);
            if (user == undefined) {
                return;
            }
            else {
                const token = yield jwt_service_1.jwtService.createJWT(user);
                const accessToken = { accessToken: token };
                return accessToken;
            }
        });
    },
};
