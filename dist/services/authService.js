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
exports.authService = void 0;
const add_1 = __importDefault(require("date-fns/add"));
const uuid_1 = require("uuid");
const jwt_service_1 = require("../application/jwt-service");
const UsersRepository_1 = require("../repositories/UsersRepository");
const blacklistTokensRepository_1 = require("../repositories/blacklistTokensRepository");
const usersService_1 = require("../services/usersService");
const setting_1 = require("../setting");
exports.authService = {
    loginAndReturnJwtKeys(loginOrEmail, password, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersService_1.userService.checkCredentialsAndReturnUser(loginOrEmail, password);
            if (!user) {
                return;
            }
            else {
                const accessToken = yield jwt_service_1.jwtService.createAccessToken(user, setting_1.settings.accessTokenLifeTime);
                const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(deviceId, setting_1.settings.refreshTokenLifeTime);
                return { accessToken: accessToken, refreshToken: refreshToken };
            }
        });
    },
    refreshTokens(user, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield jwt_service_1.jwtService.createAccessToken(user, setting_1.settings.accessTokenLifeTime);
            const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(deviceId, setting_1.settings.refreshTokenLifeTime);
            return { accessToken: accessToken, refreshToken: refreshToken };
        });
    },
    createUser(password, email, login) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield usersService_1.userService.generateSalt();
            const passwordHash = yield usersService_1.userService.generateHash(password, passwordSalt);
            const createdDate = new Date();
            const newUser = {
                id: String(Date.now()),
                accountData: {
                    login: login,
                    email: email,
                    createdAt: createdDate,
                    passwordSalt: passwordSalt,
                    passwordHash: passwordHash,
                },
                emailConfirmationData: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), { hours: 1, minutes: 3 }),
                    isConfirmed: false,
                },
            };
            const userView = yield UsersRepository_1.usersRepository.createUser(newUser);
            return userView;
        });
    },
    addTokensInBlacklist(reqBody, reqCookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const isAdded = yield blacklistTokensRepository_1.blacklistRepository.addTokensInBlacklist(reqBody, reqCookies);
            return isAdded;
        });
    },
};
