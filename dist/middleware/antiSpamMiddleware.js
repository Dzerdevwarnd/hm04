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
exports.antiSpamMiddleware = void 0;
const ipRequestsRepository_1 = require("../repositories/ipRequestsRepository");
const antiSpamMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress;
    const url = req.originalUrl;
    const ipRequests = yield ipRequestsRepository_1.ipRequestRepository.findRequestsToUrl({
        ip: ipAddress,
        url: url,
    });
    if (ipRequests.length >= 5) {
        res.sendStatus(429);
        return;
    }
    const date = new Date();
    const dateToDelete = new Date(Date.now() + 10000);
    const ipRequest = {
        ip: ipAddress,
        URL: url,
        date: date,
        dateToDelete: dateToDelete,
    };
    const result = yield ipRequestsRepository_1.ipRequestRepository.addIpRequest(ipRequest);
    setTimeout(() => {
        ipRequestsRepository_1.ipRequestRepository.deleteIpRequest({
            ip: ipAddress,
            url: url,
        });
    }, 12000);
    next();
});
exports.antiSpamMiddleware = antiSpamMiddleware;
