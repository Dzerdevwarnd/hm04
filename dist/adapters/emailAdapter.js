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
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const UsersRepository_1 = require("../repositories/UsersRepository");
exports.emailAdapter = {
    sendConfirmEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UsersRepository_1.usersRepository.findDBUser(email);
            let transport = yield nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: { user: 'dzerdevwarnd3@gmail.com', pass: 'tjqt bbvt kmzl onzs' },
            });
            let info = yield transport.sendMail({
                from: 'Warnd<dzerdevwarnd3@gmail.com>',
                to: email,
                subject: 'Email confirmation',
                html: `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user === null || user === void 0 ? void 0 : user.emailConfirmationData.confirmationCode}'>complete registration</a>
 </p>`,
            });
            console.log(info);
            return;
        });
    },
    sendRecoveryCode(email, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            let transport = yield nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: { user: 'dzerdevwarnd3@gmail.com', pass: 'tjqt bbvt kmzl onzs' },
            });
            let info = yield transport.sendMail({
                from: 'Warnd<dzerdevwarnd3@gmail.com>',
                to: email,
                subject: 'Email confirmation',
                html: `<h1>Password recovery</h1>
			<p>To finish password recovery please follow the link below:
				 <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
		 </p>`,
            });
            console.log(info);
            return;
        });
    },
};
