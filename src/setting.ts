import express from 'express'
import { blogsRouter } from './routers/blogsRouter'
import { postsRouter } from './routers/postsRouter'
import { testingRouter } from './routers/testingRouter'

export const app = express()

app.use(express.json())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)
