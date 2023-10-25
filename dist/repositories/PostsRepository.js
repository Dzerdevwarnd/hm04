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
exports.postsRepository = void 0;
const db_1 = require("../db");
exports.postsRepository = {
    returnAllPosts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = query.pageSize || 10;
            const page = query.page || 1;
            const sortBy = query.sortBy || 'createdAt';
            let sortDirection = query.sortDirection || 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const posts = yield db_1.client
                .db('hm03')
                .collection('posts')
                .find({}, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .toArray();
            const totalCount = yield db_1.client
                .db('hm03')
                .collection('posts')
                .countDocuments();
            const pageCount = Math.ceil(totalCount / pageSize);
            const postsPagination = {
                pagesCount: pageCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts,
            };
            return postsPagination;
        });
    },
    findPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield db_1.client
                .db('hm03')
                .collection('posts')
                .findOne({ id: params.id }, { projection: { _id: 0 } });
            if (post) {
                return post;
            }
            else {
                return;
            }
        });
    },
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('posts')
                .insertOne(newPost);
            //@ts-ignore
            const { _id } = newPost, postWithout_Id = __rest(newPost, ["_id"]);
            return postWithout_Id;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('posts')
                .updateOne({ id: id }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                },
            });
            return result.matchedCount === 1;
        });
    },
    deletePost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.client
                .db('hm03')
                .collection('posts')
                .deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
};
