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
exports.UserService = void 0;
const UsersRepository_1 = require("../repositories/UsersRepository");
exports.UserService = {
    returnAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return UsersRepository_1.usersRepository.returnAllUsers(query);
        });
    },
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDate = new Date();
            const newUser = {
                id: String(Date.now()),
                login: body.login,
                email: body.email,
                createdAt: createdDate,
            };
            const newUserWithout_id = UsersRepository_1.usersRepository.createUser(newUser);
            return newUserWithout_id;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultBoolean = exports.UserService.deleteUser(params);
            return resultBoolean;
        });
    },
};
