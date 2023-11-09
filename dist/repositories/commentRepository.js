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
exports.commentsRepository = void 0;
const db_1 = require("../db");
exports.commentsRepository = {
    findComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield db_1.client
                .db('hm03')
                .collection('comments')
                .findOne({ id: id });
            return foundComment;
        });
    },
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfDelete = yield db_1.client
                .db('hm03')
                .collection('comments')
                .deleteOne({ id: id });
            return resultOfDelete.deletedCount === 1;
        });
    },
    updateComment(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield db_1.client
                .db('hm03')
                .collection('comments')
                .updateOne({ id: id }, {
                $set: {
                    content: body.content,
                },
            });
            return resultOfUpdate.matchedCount === 1;
        });
    },
};
