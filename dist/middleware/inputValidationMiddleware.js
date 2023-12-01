"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        let errorsMessages = [];
        for (let i = 0; i < errors.length; i++) {
            let errorResponse = { message: '', field: '' };
            errorResponse.message = errors[i].msg;
            //@ts-ignore
            errorResponse.field = errors[i].path;
            errorsMessages.push(errorResponse);
        }
        res.status(400).json({ errorsMessages });
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
