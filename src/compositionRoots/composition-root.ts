import { Container } from 'inversify'
import 'reflect-metadata'
import { BlogsController } from '../controllers/BlogsController'
import { CommentsController } from '../controllers/commentsController'
import { PostsController } from '../controllers/postsController'
import { PostsRepository } from '../repositories/PostsRepository'
import { BlogsRepository } from '../repositories/blogsRepository'
import { CommentsRepository } from '../repositories/commentRepository'
import { BlogsService } from '../services/blogsService'
import { CommentsService } from '../services/commentsService'
import { PostsService } from '../services/postsService'

export const appContainer = new Container()

appContainer.bind<CommentsController>(CommentsController).to(CommentsController)
appContainer.bind<CommentsService>(CommentsService).toSelf()
appContainer.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)

appContainer.bind(BlogsController).to(BlogsController)
appContainer.bind(BlogsService).to(BlogsService)
appContainer.bind(BlogsRepository).to(BlogsRepository)

appContainer.bind(PostsController).to(PostsController)
appContainer.bind(PostsService).to(PostsService)
appContainer.bind(PostsRepository).to(PostsRepository)
