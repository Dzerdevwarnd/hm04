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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const setting_1 = require("../setting");
exports.jwtService = {
    createAccessToken(user, expirationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const AccessToken = jsonwebtoken_1.default.sign({ userId: user.id }, setting_1.settings.JWT_SECRET, {
                expiresIn: expirationTime,
            });
            return AccessToken;
        });
    },
    createRefreshToken(deviceId, expirationTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const RefreshToken = jsonwebtoken_1.default.sign({ deviceId: deviceId }, setting_1.settings.JWT_SECRET, {
                expiresIn: expirationTime,
            });
            return RefreshToken;
        });
    },
    verifyAndGetUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, setting_1.settings.JWT_SECRET);
                return result.userId;
            }
            catch (error) {
                return;
            }
        });
    },
    verifyAndGetDeviceIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, setting_1.settings.JWT_SECRET);
                return result.deviceId;
            }
            catch (error) {
                return;
            }
        });
    },
    createRecoveryCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const RecoveryCode = yield jsonwebtoken_1.default.sign({ email: email }, setting_1.settings.JWT_SECRET, {
                expiresIn: setting_1.settings.recoveryCodeLifeTime,
            });
            return RecoveryCode;
        });
    },
    verifyJwtToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield jsonwebtoken_1.default.verify(token, setting_1.settings.JWT_SECRET);
                return true;
            }
            catch (error) {
                return;
            }
        });
    },
};
