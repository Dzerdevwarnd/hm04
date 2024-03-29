"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CommentsController = void 0;
const inversify_1 = require("inversify");
//import 'reflect-metadata'
const jwt_service_1 = require("../application/jwt-service");
const commentsService_1 = require("../services/commentsService");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = undefined;
            if (req.headers.authorization) {
                userId = yield jwt_service_1.jwtService.verifyAndGetUserIdByToken(req.headers.authorization.split(' ')[1]);
            }
            const foundComment = yield this.commentsService.findComment(req.params.id, userId);
            if (!foundComment) {
                res.sendStatus(404);
                return;
            }
            else {
                res.status(200).send(foundComment);
                return;
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
            if (!comment) {
                res.sendStatus(404);
                return;
            }
            if (comment.commentatorInfo.userId !== req.user.id) {
                res.sendStatus(403);
                return;
            }
            const ResultOfDelete = yield this.commentsService.deleteComment(req.params.id);
            res.sendStatus(204);
            return;
        });
    }
    updateCommentContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
            if (!comment) {
                res.sendStatus(404);
                return;
            }
            if (comment.commentatorInfo.userId !== req.user.id) {
                res.sendStatus(403);
                return;
            }
            const resultOfUpdate = yield this.commentsService.updateComment(req.params.id, req.body);
            res.sendStatus(204);
            return;
        });
    }
    updateCommentLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsService.findComment(req.params.id, req.headers.authorization.split(' ')[1]);
            if (!comment) {
                res.sendStatus(404);
                return;
            }
            const resultOfUpdate = yield this.commentsService.updateCommentLikeStatus(req.params.id, req.body, req.headers.authorization.split(' ')[1]);
            res.sendStatus(204);
            return;
        });
    }
};
exports.CommentsController = CommentsController;
exports.CommentsController = CommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [commentsService_1.CommentsService])
], CommentsController);
