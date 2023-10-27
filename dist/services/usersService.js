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
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UsersRepository_1 = require("../repositories/UsersRepository");
exports.userService = {
    returnAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersRepository_1.usersRepository.returnAllUsers(query);
        });
    },
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this.generateHash(body.password, passwordSalt);
            const createdDate = new Date();
            const newUser = {
                id: String(Date.now()),
                login: body.login,
                email: body.email,
                createdAt: createdDate,
                passwordSalt: passwordSalt,
                passwordHash: passwordHash,
            };
            const userView = yield UsersRepository_1.usersRepository.createUser(newUser);
            return userView;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultBoolean = yield exports.userService.deleteUser(params);
            return resultBoolean;
        });
    },
    generateHash(password, passwordSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, passwordSalt);
            return hash;
        });
    },
    checkCreditionals(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UsersRepository_1.usersRepository.findDBUser(loginOrEmail);
            if (!user) {
                return false;
            }
            if (user.passwordHash !==
                (yield this.generateHash(password, user.passwordSalt))) {
                return false;
            }
            else {
                return true;
            }
        });
    },
};
