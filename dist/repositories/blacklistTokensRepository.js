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
exports.blacklistRepository = exports.BlacklistTokensModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const setting_1 = require("../setting");
const BlacklistTokensSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true },
    expireDate: { type: Date, required: true },
});
exports.BlacklistTokensModel = mongoose_1.default.model('BlacklistTokens', BlacklistTokensSchema);
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
            const result = yield exports.BlacklistTokensModel.insertMany([
                accessTokenDB,
                refreshTokenDB,
            ]);
            setTimeout(() => exports.BlacklistTokensModel.deleteOne({ token: accessTokenDB.token }), parseInt(setting_1.settings.accessTokenLifeTime));
            setTimeout(() => exports.BlacklistTokensModel.deleteOne({ token: refreshTokenDB.token }), parseInt(setting_1.settings.refreshTokenLifeTime));
            return result.length == 2;
        });
    },
    addRefreshTokenInBlacklist(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenDB = {
                token: cookies.refreshToken,
                expireDate: new Date(//@ts-ignore
                Date.now() + parseInt(setting_1.settings.refreshTokenLifeTime.match(/\d+/))),
            };
            const result = yield exports.BlacklistTokensModel.insertMany(refreshTokenDB);
            setTimeout(() => exports.BlacklistTokensModel.deleteOne({ token: refreshTokenDB.token }), parseInt(setting_1.settings.refreshTokenLifeTime));
            return result.length == 1;
        });
    },
};
