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
			html: `Thank for your registration
			To finish registration please follow the link below:
			 https://vercel.com/dzerdevwarnd/hm04/auth/registration-confirmation?code=${user?.emailConfirmationData.confirmationCode} complete registration
			`,
		})
		console.log(info)
		return
	},
}
