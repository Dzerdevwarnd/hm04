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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRepository = void 0;
const db_1 = require("../db");
exports.usersRepository = {
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
                login: { $regex: searchLoginTerm, $options: 'i' },
                email: { $regex: searchEmailTerm, $options: 'i' },
            }, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .toArray();
            const totalCount = yield db_1.client
                .db('hm03')
                .collection('users')
                .countDocuments({
                login: { $regex: searchLoginTerm, $options: 'i' },
                email: { $regex: searchEmailTerm, $options: 'i' },
            });
            const pagesCount = Math.ceil(totalCount / pageSize);
            const usersPagination = {
                pagesCount: pagesCount,
                page: Number(page),
                pageSize: pageSize,
                totalCount: totalCount,
                items: users,
            };
            return usersPagination;
        });
    },
    findDBUser(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield db_1.client
                .db('hm03')
                .collection('users')
                .findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
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
            const { _id, passwordHash, passwordSalt } = newUser, userView = __rest(newUser, ["_id", "passwordHash", "passwordSalt"]);
            return userView;
        });
    },
    deleteUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.client
                .db('hm03')
                .collection('users')
                .deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
};
