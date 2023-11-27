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
const add_1 = __importDefault(require("date-fns/add"));
const uuid_1 = require("uuid");
const UsersRepository_1 = require("../repositories/UsersRepository");
exports.userService = {
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UsersRepository_1.usersRepository.findUser(id);
            return user;
        });
    },
    returnAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UsersRepository_1.usersRepository.returnAllUsers(query);
        });
    },
    createUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield this.generateSalt();
            const passwordHash = yield this.generateHash(body.password, passwordSalt);
            const createdDate = new Date();
            const newUser = {
                id: String(Date.now()),
                accountData: {
                    login: body.login,
                    email: body.email,
                    createdAt: createdDate,
                    passwordSalt: passwordSalt,
                    passwordHash: passwordHash,
                },
                emailConfirmationData: {
                    confirmationCode: uuid_1.v4,
                    expirationDate: (0, add_1.default)(new Date(), { hours: 1, minutes: 3 }),
                    isConfirmed: true,
                },
            };
            const userView = yield UsersRepository_1.usersRepository.createUser(newUser);
            return userView;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultBoolean = yield UsersRepository_1.usersRepository.deleteUser(params);
            return resultBoolean;
        });
    },
    generateHash(password, passwordSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, passwordSalt);
            return hash;
        });
    },
    generateSalt() {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            return salt;
        });
    },
    checkCredentialsAndReturnUser(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UsersRepository_1.usersRepository.findDBUser(loginOrEmail);
            if (!user) {
                return undefined;
            }
            if (user.accountData.passwordHash !==
                (yield this.generateHash(password, user.accountData.passwordSalt))) {
                return undefined;
            }
            else {
                return user;
            }
        });
    },
    userEmailConfirmationAccept(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const isConfirmationAccept = yield UsersRepository_1.usersRepository.userEmailConfirmationAccept(confirmationCode);
            return isConfirmationAccept;
        });
    },
    findDBUserByConfirmationCode(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UsersRepository_1.usersRepository.findDBUserByConfirmationCode(confirmationCode);
            return user;
        });
    },
};
