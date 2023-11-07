import { UserDbType } from '../repositories/UsersRepository'

declare global {
	namespace Express {
		export interface Request {
			user: UserDbType | null
		}
	}
}
