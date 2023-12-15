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
exports.refreshTokensMetaRepository = void 0;
const jwt_service_1 = require("../application/jwt-service");
const db_1 = require("../db");
const setting_1 = require("../setting");
exports.refreshTokensMetaRepository = {
    createRefreshToken(refreshTokenMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const expireDate = new Date(//@ts-ignore
            Date.now() + parseInt(setting_1.settings.refreshTokenLifeTime.match(/\d+/)));
            yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .createIndex({ expireDate: 1 }, { expireAfterSeconds: 0 });
            const result = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .insertOne(refreshTokenMeta);
            return result.acknowledged;
        });
    },
    updateRefreshTokenMeta(deviceId, refreshTokenMetaUpd) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .updateOne({ deviceId: deviceId }, {
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
            const refreshTokenMeta = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .findOne({ deviceId: deviceId });
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
            const devicesDB = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .find({ userId: UserId })
                .toArray();
            const devicesView = [];
            console.log(devicesDB);
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
            const resultOfDelete = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .deleteMany({ userId: UserId });
            return resultOfDelete.acknowledged;
        });
    },
    deleteOneUserDeviceAndReturnStatusCode(requestDeviceId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = yield jwt_service_1.jwtService.verifyAndGetDeviceIdByToken(refreshToken);
            if (!deviceId) {
                return 401;
            }
            const requestRefreshTokensMeta = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .findOne({ deviceId: requestDeviceId });
            if (!requestRefreshTokensMeta) {
                return 404;
            }
            const userId = yield this.findUserIdByDeviceId(deviceId);
            if (userId !== (requestRefreshTokensMeta === null || requestRefreshTokensMeta === void 0 ? void 0 : requestRefreshTokensMeta.userId)) {
                return 403;
            }
            const resultOfDelete = yield db_1.client
                .db('hm03')
                .collection('refreshTokensMeta')
                .deleteOne({ deviceId: deviceId });
            if (resultOfDelete.deletedCount === 0) {
                return 404;
            }
            return 204;
        });
    },
};
