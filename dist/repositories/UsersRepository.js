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
exports.usersRepository = void 0;
const db_1 = require("../db");
exports.usersRepository = {
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.client
                .db('hm03')
                .collection('users')
                .findOne({ id: id });
            return user;
        });
    },
    returnAllUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = Number(query.pageSize) || 10;
            const page = Number(query.pageNumber) || 1;
            const sortBy = query.sortBy || 'createdAt';
            const searchLoginTerm = query.searchLoginTerm || '';
            const searchEmailTerm = query.searchEmailTerm || '';
            let sortDirection = query.sortDirection || 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const users = yield db_1.client
                .db('hm03')
                .collection('users')
                .find({
                $or: [
                    { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
                    { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
                ],
            })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .toArray();
            const totalCount = yield db_1.client
                .db('hm03')
                .collection('users')
                .countDocuments({
                $or: [
                    { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
                    { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
                ],
            });
            const pagesCount = Math.ceil(totalCount / pageSize);
            const usersView = users.map(({ id, accountData }) => ({
                id,
                login: accountData.login,
                email: accountData.email,
                createdAt: accountData.createdAt,
            }));
            const usersPagination = {
                pagesCount: pagesCount,
                page: Number(page),
                pageSize: pageSize,
                totalCount: totalCount,
                items: usersView,
            };
            return usersPagination;
        });
    },
    findDBUser(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.client
                .db('hm03')
                .collection('users')
                .findOne({
                $or: [
                    { 'accountData.email': loginOrEmail },
                    { 'accountData.login': loginOrEmail },
                ],
            });
            //@ts-ignore
            return user;
        });
    },
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('users')
                .insertOne(newUser);
            //@ts-ignore
            const userView = {
                id: newUser.id,
                login: newUser.accountData.login,
                email: newUser.accountData.login,
                createdAt: newUser.accountData.createdAt,
            };
            return userView;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('users')
                .deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
    userEmailConfirmationAccept(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.client
                .db('hm03')
                .collection('users')
                .findOne({ 'emailConfirmationData.confirmationCode': confirmationCode });
            if (!user) {
                return false;
            }
            if (new Date() > (user === null || user === void 0 ? void 0 : user.emailConfirmationData.expirationDate)) {
                return false;
            }
            const resultOfUpdate = yield db_1.client
                .db('hm03')
                .collection('users')
                .updateOne({ 'emailConfirmationData.confirmationCode': confirmationCode }, { $set: { 'emailConfirmationData.isConfirmed': true } });
            return resultOfUpdate.modifiedCount === 1;
        });
    },
};
//
