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
exports.refreshTokensMetaRepository = exports.refreshTokensMetaModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_service_1 = require("../application/jwt-service");
const setting_1 = require("../setting");
const refreshTokensMetaSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    ip: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    expiredAt: { type: Date, required: true },
});
exports.refreshTokensMetaModel = mongoose_1.default.model('refreshTokensMeta', refreshTokensMetaSchema);
exports.refreshTokensMetaRepository = {
    createRefreshToken(refreshTokenMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const expireDate = new Date(//@ts-ignore
            Date.now() + parseInt(setting_1.settings.refreshTokenLifeTime.match(/\d+/)));
            const result = yield exports.refreshTokensMetaModel.insertMany(refreshTokenMeta);
            setTimeout(() => exports.refreshTokensMetaModel.deleteOne({
                deviceId: refreshTokenMeta.deviceId,
            }), parseInt(setting_1.settings.refreshTokenLifeTime));
            return result.length == 1;
        });
    },
    updateRefreshTokenMeta(deviceId, refreshTokenMetaUpd) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.refreshTokensMetaModel.updateOne({ deviceId: deviceId }, {
                $set: {
                    lastActiveDate: refreshTokenMetaUpd.lastActiveDate,
                    expiredAt: refreshTokenMetaUpd.expiredAt,
                },
            });
            return result.matchedCount === 1;
        });
    },
    findUserIdByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokenMeta = yield exports.refreshTokensMetaModel.findOne({
                deviceId: deviceId,
            });
            const userId = refreshTokenMeta === null || refreshTokenMeta === void 0 ? void 0 : refreshTokenMeta.userId;
            return userId;
        });
    },
    returnAllUserDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.verifyAndGetDeviceIdByToken(refreshToken);
            if (!deviceId) {
                return;
            }
            const UserId = yield this.findUserIdByDeviceId(deviceId);
            const devicesDB = yield exports.refreshTokensMetaModel
                .find({ userId: UserId })
                .lean();
            const devicesView = [];
            for (let i = 0; i < devicesDB.length; i++) {
                let deviceView = {
                    ip: devicesDB[i].ip,
                    title: devicesDB[i].title,
                    deviceId: devicesDB[i].deviceId,
                    lastActiveDate: devicesDB[i].lastActiveDate,
                };
                devicesView.push(deviceView);
            }
            return devicesView;
        });
    },
    deleteAllUserDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.verifyAndGetDeviceIdByToken(refreshToken);
            if (!deviceId) {
                return;
            }
            const UserId = yield this.findUserIdByDeviceId(deviceId);
            const resultOfDelete = yield exports.refreshTokensMetaModel.deleteMany({
                deviceId: { $ne: deviceId },
                userId: UserId,
            });
            return resultOfDelete.acknowledged;
        });
    },
    deleteOneUserDeviceAndReturnStatusCode(requestDeviceId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.verifyAndGetDeviceIdByToken(refreshToken);
            if (!deviceId) {
                return 401;
            }
            const requestRefreshTokensMeta = yield exports.refreshTokensMetaModel.findOne({
                deviceId: requestDeviceId,
            });
            if (!requestRefreshTokensMeta) {
                return 404;
            }
            const userId = yield this.findUserIdByDeviceId(deviceId);
            if (userId !== (requestRefreshTokensMeta === null || requestRefreshTokensMeta === void 0 ? void 0 : requestRefreshTokensMeta.userId)) {
                return 403;
            }
            const resultOfDelete = yield exports.refreshTokensMetaModel.deleteOne({
                deviceId: requestDeviceId,
            });
            if (resultOfDelete.deletedCount === 0) {
                return 404;
            }
            return 204;
        });
    },
};
