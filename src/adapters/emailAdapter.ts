import nodemailer from 'nodemailer'
import { usersRepository } from '../repositories/UsersRepository'

export const emailAdapter = {
	async sendConfirmEmail(email: string) {
		const user = await usersRepository.findDBUser(email)
		let transport = await nodemailer.createTransport({
			service: 'gmail',
			auth: { user: 'dzerdevwarnd3@gmail.com', pass: 'tjqt bbvt kmzl onzs' },
		})
		let info = await transport.sendMail({
			from: 'Warnd<dzerdevwarnd3@gmail.com>',
			to: email,
			subject: 'Email confirmation',
			html: `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user?.emailConfirmationData.confirmationCode}'>complete registration</a>
 </p>`,
		})
		console.log(info)
		return
	},
	async sendRecoveryCode(email: string, recoveryCode: string) {
		let transport = await nodemailer.createTransport({
			service: 'gmail',
			auth: { user: 'dzerdevwarnd3@gmail.com', pass: 'tjqt bbvt kmzl onzs' },
		})
		let info = await transport.sendMail({
			from: 'Warnd<dzerdevwarnd3@gmail.com>',
			to: email,
			subject: 'Email confirmation',
			html: `<h1>Password recovery</h1>
			<p>To finish password recovery please follow the link below:
				 <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
		 </p>`,
		})
		console.log(info)
		return
	},
}
