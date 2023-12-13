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
const db_1 = require("../db");
const antiSpamMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipAddress = req.ip ||
        req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress;
    const url = req.baseUrl;
    const date = new Date();
    const dateToDelete = new Date(Date.now() + 10000);
    const ipRequest = {
        ip: ipAddress,
        URL: url,
        date: date,
        dateToDelete: dateToDelete,
    };
    yield db_1.client
        .db('hm03')
        .collection('ipRequests')
        .createIndex({ dateToDelete: 1 }, { expireAfterSeconds: 0 });
    const result = yield db_1.client
        .db('hm03')
        .collection('ipRequests')
        .insertOne(ipRequest);
    next();
});
exports.antiSpamMiddleware = antiSpamMiddleware;
