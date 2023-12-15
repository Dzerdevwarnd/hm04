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
exports.securityRouter = void 0;
const express_1 = require("express");
const refreshTokensMetaRepository_1 = require("../repositories/refreshTokensMetaRepository");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield refreshTokensMetaRepository_1.refreshTokensMetaRepository.returnAllUserDevices(req.cookies.refreshToken);
    if (!devices) {
        res.sendStatus(401);
        return;
    }
    res.status(200).send(devices);
}), exports.securityRouter.delete('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield refreshTokensMetaRepository_1.refreshTokensMetaRepository.deleteAllUserDevices(req.cookies.refreshToken);
    if (!isDeleted) {
        res.sendStatus(401);
        return;
    }
    res.sendStatus(204);
})), exports.securityRouter.delete('/devices/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const StatusCode = yield refreshTokensMetaRepository_1.refreshTokensMetaRepository.deleteOneUserDeviceAndReturnStatusCode(req.params.id, req.cookies.refreshToken);
    res.sendStatus(StatusCode);
})));
