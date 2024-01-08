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
exports.ipRequestRepository = exports.ipRequestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ipRequestSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
    dateToDelete: { type: Date, required: true },
});
exports.ipRequestModel = mongoose_1.default.model('ipRequests', ipRequestSchema);
exports.ipRequestRepository = {
    findRequestsToUrl(ipAndUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const ipRequests = yield exports.ipRequestModel
                .find({ ip: ipAndUrl.ip, URL: ipAndUrl.url })
                .lean();
            return ipRequests;
        });
    },
    addIpRequest(ipRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.ipRequestModel.insertMany(ipRequest);
            return result.length == 1;
        });
    },
    deleteIpRequest(ipAndUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.ipRequestModel.deleteOne({
                ip: ipAndUrl.ip,
                URL: ipAndUrl.url,
            });
            return result.deletedCount == 1;
        });
    },
};
