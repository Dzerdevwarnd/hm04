import { jwtService } from '../application/jwt-service'
import { userService } from '../services/usersService'

export const authService = {
	async loginAndReturnJwtKey(loginOrEmail: string, password: string) {
		const user = await userService.checkCredentionalsAndReturnUser(
			loginOrEmail,
			password
		)
		if (user == undefined) {
			return
		} else {
			const token = await jwtService.createJWT(user)
			const accessToken = { accessToken: token }
			return accessToken
		}
	},
}
