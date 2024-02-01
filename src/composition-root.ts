import { Container } from 'inversify'
import 'reflect-metadata'
import { CommentsController } from './controllers/commentsController'
import { CommentsRepository } from './repositories/commentRepository'
import { CommentsService } from './services/commentsService'

export const container = new Container()

container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
