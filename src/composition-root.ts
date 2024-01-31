import { CommentsRepository } from './repositories/commentRepository'
import { CommentsController } from './routers/commentsRouter'
import { CommentsService } from './services/commentsService'

const commentsRepository = new CommentsRepository()
const commentsService = new CommentsService(commentsRepository)

export const commentsControllerInstance = new CommentsController(
	commentsService
)
