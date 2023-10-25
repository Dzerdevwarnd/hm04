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
exports.blogsRepository = void 0;
const db_1 = require("../db");
exports.blogsRepository = {
    returnAllBlogs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageSize = Number(query.pageSize) || 10;
            const page = Number(query.pageNumber) || 1;
            const sortBy = query.sortBy || 'createdAt';
            const searchNameTerm = query.searchNameTerm || '';
            let sortDirection = query.sortDirection || 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            const blogs = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .find({ name: { $regex: searchNameTerm } }, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .toArray();
            const totalCount = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .countDocuments();
            const pagesCount = Math.ceil(totalCount / pageSize);
            const blogsPagination = {
                pagesCount: pagesCount,
                page: Number(page),
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogs,
            };
            return blogsPagination;
        });
    },
    findBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .findOne({ id: params.id }, { projection: { _id: 0 } });
            if (blog) {
                return blog;
            }
            else {
                return;
            }
        });
    },
    findPostsByBlogId(params, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield db_1.client
                .db('hm03')
                .collection('posts')
                .find()
                .toArray();
            const totalCount = allPosts.length;
            const pageSize = query.pageSize || 10;
            const page = query.pageNumber || 1;
            const sortBy = query.sortBy || 'createdAt';
            let sortDirection = query.sortDirection || 'desc';
            if (sortDirection === 'desc') {
                sortDirection = -1;
            }
            else {
                sortDirection = 1;
            }
            let posts = yield db_1.client
                .db('hm03')
                .collection('posts')
                .find({ blogId: params.id }, { projection: { _id: 0 } })
                .skip((page - 1) * pageSize)
                .sort({ [sortBy]: sortDirection })
                .limit(pageSize)
                .toArray();
            const pageCount = Math.ceil(totalCount / pageSize);
            const postsPagination = {
                pagesCount: pageCount,
                page: page,
                pageSize: pageSize,
                totalCount: totalCount,
                items: posts,
            };
            if (posts) {
                return postsPagination;
            }
            else {
                return;
            }
        });
    },
    createBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .insertOne(newBlog);
            //@ts-ignore
            const { _id } = newBlog, blogWithout_Id = __rest(newBlog, ["_id"]);
            return blogWithout_Id;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .updateOne({ id: id }, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                },
            });
            return result.matchedCount === 1;
        });
    },
    deleteBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.client
                .db('hm03')
                .collection('blogs')
                .deleteOne({ id: params.id });
            return result.deletedCount === 1;
        });
    },
};
