import express from 'express'
import { authRouter } from './routers/authRouter'
import { blogsRouter } from './routers/blogsRouter'
import { postsRouter } from './routers/postsRouter'
import { testingRouter } from './routers/testingRouter'
import { usersRouter } from './routers/usersRouter'

export const app = express()

export const settings = {
	MONGO_URL:
		process.env.MONGO_URL ||
		'mongodb+srv://admin:qwerty123@cluster0.hzh4nyr.mongodb.net/?retryWrites=true&w=majority',
	JWT_SECRET: process.env.JWT_SECRET || '123',
}

export const routersPaths = {
	auth: '/auth',
	blogs: '/blogs',
	posts: '/posts',
	users: '/users',
	testing: '/testing',
}

app.use(express.json())

app.use(routersPaths.auth, authRouter)
app.use(routersPaths.blogs, blogsRouter)
app.use(routersPaths.posts, postsRouter)
app.use(routersPaths.users, usersRouter)
app.use(routersPaths.testing, testingRouter)
