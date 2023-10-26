import express from 'express'
import { blogsRouter } from './routers/blogsRouter'
import { postsRouter } from './routers/postsRouter'
import { testingRouter } from './routers/testingRouter'
import { usersRouter } from './routers/usersRouter'

export const app = express()

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/testing', testingRouter)
