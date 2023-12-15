import cookieParser from 'cookie-parser'
import express from 'express'
import { authRouter } from './routers/authRouter'
import { blogsRouter } from './routers/blogsRouter'
import { commentsRouter } from './routers/commentsRouter'
import { postsRouter } from './routers/postsRouter'
import { securityRouter } from './routers/securityRouter'
import { testingRouter } from './routers/testingRouter'
import { usersRouter } from './routers/usersRouter'

export const app = express()

export const settings = {
	MONGO_URL:
		process.env.MONGO_URL ||
		'mongodb+srv://admin:qwerty123@cluster0.hzh4nyr.mongodb.net/?retryWrites=true&w=majority',
	JWT_SECRET: process.env.JWT_SECRET || '123',
	accessTokenLifeTime: '100000ms',
	refreshTokenLifeTime: '200000ms',
}

export const routersPaths = {
	auth: '/auth',
	blogs: '/blogs',
	posts: '/posts',
	users: '/users',
	testing: '/testing',
	comments: '/comments',
	security: '/security',
}

app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

app.use(routersPaths.auth, authRouter)
app.use(routersPaths.blogs, blogsRouter)
app.use(routersPaths.posts, postsRouter)
app.use(routersPaths.users, usersRouter)
app.use(routersPaths.testing, testingRouter)
app.use(routersPaths.comments, commentsRouter)
app.use(routersPaths.security, securityRouter)
