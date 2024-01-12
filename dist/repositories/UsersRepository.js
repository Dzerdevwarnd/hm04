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
exports.usersRepository = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const userSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    accountData: {
        type: {
            login: { type: String, required: true },
            email: { type: String, required: true },
            createdAt: { type: Date, required: true },
            passwordSalt: { type: String, required: true },
            passwordHash: { type: String, required: true },
            recoveryCode: { type: String, default: '' },
        },
        required: true,
    },
    emailConfirmationData: {
        type: {
            confirmationCode: { type: String, required: true },
            expirationDate: { type: Date, required: true },
            isConfirmed: { type: Boolean, required: true },
        },
        required: true,
    },
});
exports.userModel = mongoose_1.default.model('users', userSchema);
exports.usersRepository = {
    findUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exports.userModel.findOne({ id: id });
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
            const users = yield exports.userModel
                .find({
                $or: [
                    { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } },
                    { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } },
                ],
            })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .lean();
            const totalCount = yield exports.userModel.countDocuments({
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
            let user = yield exports.userModel.findOne({
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
            const result = yield exports.userModel.insertMany(newUser);
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
    updateRecoveryCode(email, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.userModel.updateOne({ 'accountData.email': email }, {
                $set: {
                    'accountData.recoveryCode': recoveryCode,
                },
            });
            return result.matchedCount == 1;
        });
    },
    updateUserSaltAndHash(recoveryCode, passwordSalt, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.userModel.updateOne({ 'accountData.recoveryCode': recoveryCode }, {
                $set: {
                    'accountData.passwordSalt': passwordSalt,
                    'accountData.passwordHash': passwordHash,
                },
            });
            return result.matchedCount == 1;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.userModel.deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
    userEmailConfirmationAccept(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultOfUpdate = yield exports.userModel.updateOne({ 'emailConfirmationData.confirmationCode': confirmationCode }, { $set: { 'emailConfirmationData.isConfirmed': true } });
            return resultOfUpdate.modifiedCount === 1;
        });
    },
    userConfirmationCodeUpdate(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmationCode = yield (0, uuid_1.v4)();
            const resultOfUpdate = yield exports.userModel.updateOne({ 'accountData.email': email }, { $set: { 'emailConfirmationData.confirmationCode': confirmationCode } });
            if (resultOfUpdate.matchedCount === 1) {
                return confirmationCode;
            }
            else {
                return;
            }
        });
    },
    findDBUserByConfirmationCode(confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exports.userModel.findOne({
                'emailConfirmationData.confirmationCode': confirmationCode,
            });
            return user;
        });
    },
};
//
