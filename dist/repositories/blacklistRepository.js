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
exports.blacklistRepository = void 0;
const db_1 = require("../db");
const setting_1 = require("../setting");
exports.blacklistRepository = {
    addTokensInBlacklist(reqBody, reqCookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessTokenDB = {
                token: reqBody.accessToken,
                expireDate: new Date(//@ts-ignore
                Date.now() + parseInt(setting_1.settings.accessTokenLifeTime.match(/\d+/))),
            };
            const refreshTokenDB = {
                token: reqCookies.refreshToken,
                expireDate: new Date(//@ts-ignore
                Date.now() + parseInt(setting_1.settings.refreshTokenLifeTime.match(/\d+/))),
            };
            yield db_1.client
                .db('hm03')
                .collection('BlacklistTokens')
                .createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 });
            const result = yield db_1.client
                .db('hm03')
                .collection('BlacklistTokens')
                .insertMany([accessTokenDB, refreshTokenDB]);
            return result.insertedCount === 2;
        });
    },
    addRefreshTokenInBlacklist(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDB = {
                token: cookies.refreshToken,
                expireDate: new Date(//@ts-ignore
                Date.now() + parseInt(setting_1.settings.refreshTokenLifeTime.match(/\d+/))),
            };
            yield db_1.client
                .db('hm03')
                .collection('BlacklistTokens')
                .createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 });
            const result = yield db_1.client
                .db('hm03')
                .collection('BlacklistTokens')
                .insertOne(refreshTokenDB);
            return result.acknowledged;
        });
    },
};
