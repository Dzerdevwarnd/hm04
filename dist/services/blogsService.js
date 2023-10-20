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
exports.blogsService = void 0;
const blogsRepository_1 = require("../repositories/blogsRepository");
exports.blogsService = {
    returnAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return blogsRepository_1.blogsRepository.returnAllBlogs();
        });
    },
    findBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogsRepository_1.blogsRepository.findBlog(params);
        });
    },
    findPostsByBlogId(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogsRepository_1.blogsRepository.findPostsByBlogId(params);
        });
    },
    createBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdDate = new Date();
            const newBlog = {
                id: String(Date.now()),
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl,
                createdAt: createdDate,
                isMembership: false,
            };
            const newBlogWithout_id = blogsRepository_1.blogsRepository.createBlog(newBlog);
            return newBlogWithout_id;
        });
    },
    updateBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultBoolean = blogsRepository_1.blogsRepository.updateBlog(id, body);
            return resultBoolean;
        });
    },
    deleteBlog(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultBoolean = blogsRepository_1.blogsRepository.deleteBlog(params);
            return resultBoolean;
        });
    },
};
