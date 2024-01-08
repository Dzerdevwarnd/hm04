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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = exports.postModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
});
exports.postModel = mongoose_1.default.model('posts', postSchema);
exports.postsRepository = {
    returnAllPosts(query) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = Number(query === null || query === void 0 ? void 0 : query.pageSize) || 10;
            const page = Number(query === null || query === void 0 ? void 0 : query.pageNumber) || 1;
            const sortBy = (_a = query === null || query === void 0 ? void 0 : query.sortBy) !== null && _a !== void 0 ? _a : 'createdAt';
            let sortDirection = (_b = query === null || query === void 0 ? void 0 : query.sortDirection) !== null && _b !== void 0 ? _b : 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const posts = yield exports.postModel
                .find({}, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
                .limit(pageSize)
                .lean();
            const totalCount = yield exports.postModel.countDocuments();
            const pagesCount = Math.ceil(totalCount / pageSize);
            const postsPagination = {
                pagesCount: pagesCount,
                page: Number(page),
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts,
            };
            return postsPagination;
        });
    },
    findPost(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield exports.postModel.findOne({ id: params.id }, { projection: { _id: 0 } });
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
            const result = yield exports.postModel.insertMany(newPost);
            //@ts-ignore
            const { _id } = newPost, postWithout_Id = __rest(newPost, ["_id"]);
            return postWithout_Id;
        });
    },
    updatePost(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield exports.postModel.updateOne({ id: id }, {
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
            let result = yield exports.postModel.deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
};
