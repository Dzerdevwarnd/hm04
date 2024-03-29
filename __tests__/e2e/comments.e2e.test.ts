import mongoose from 'mongoose'
import request from 'supertest'
import { postsRepository } from '../../src/repositories/PostsRepository'
import { blogsRepository } from '../../src/repositories/blogsRepository'
import { authService } from '../../src/services/authService'
import { blogsService } from '../../src/services/blogsService'
import { postsService } from '../../src/services/postsService'
import { userService } from '../../src/services/usersService'
import { app, routersPaths, settings } from '../../src/setting'

describe('/comments', () => {
	beforeAll(async () => {
		/* Connecting to the database. */
		await mongoose.connect(settings.MONGO_URL)
	})

	afterAll(async () => {
		/* Closing database connection after each test. */
		await mongoose.connection.close()
	})
	let entityId: string | undefined
	let entityCreatedAt: string | undefined
	let blogId: string | undefined
	let postId: string | undefined
	let jwtAccessToken: string | undefined
	let commentId: string | undefined
	const email = 'dzerdevwarnd@gmail.com'
	const login = 'string'
	const password = '123321'

	it('should return 201 and one entity object', async () => {
		await blogsService.createBlog({
			//Создание блога и поста для дальнейшей проверки комментариев
			name: 'Cu11r',
			description: '1',
			websiteUrl: 'cucumber.org',
		})
		blogId = (await blogsRepository.returnAllBlogs('')).items[0].id

		postsService.createPost({
			title: '1234123',
			shortDescription: 'string',
			content: 'фывыфвыфвыф',
			blogId: 'blogId',
		})
		postId = (await postsRepository.returnAllPosts('')).items[0].id

		userService.createUser({ login, password, email }) // создание юзера и jwt ключа
		const accessToken = await authService.loginAndReturnJwtKeys(
			login,
			password,
			'Key for deviceId to refreshToken'
		)
		jwtAccessToken = accessToken?.accessToken

		const res = await request(app)
			.post(`${routersPaths.posts}/${postId}/comments`)
			.send({
				content:
					'test stringtest stringtest stringtest stringtest stringtest string',
			})
			.set('Authorization', 'bearer ' + jwtAccessToken)
		expect(res.status).toEqual(201)
		expect(res.body).toEqual({
			id: expect.any(String),
			content:
				'test stringtest stringtest stringtest stringtest stringtest string',
			commentatorInfo: {
				userId: expect.any(String),
				userLogin: login,
			},
			createdAt: expect.any(String),
			likesInfo: {
				likesCount: 0,
				dislikesCount: 0,
				myStatus: 'None',
			},
		})
		entityId = res.body.id
		entityCreatedAt = res.body.createdAt
		commentId = res.body.id
		console.log('jwtAccessToken=', jwtAccessToken)
		console.log('postId=', postId)
		console.log('commentId=', commentId)
	})

	it('should return 200 and comments pagination', async () => {
		const res = await request(app).get(
			`${routersPaths.posts}/${postId}/comments`
		)
		expect(res.status).toEqual(200)
		expect(res.body).toEqual({
			pagesCount: 1,
			page: 1,
			pageSize: 10,
			totalCount: 1,
			items: [
				{
					id: commentId,
					content:
						'test stringtest stringtest stringtest stringtest stringtest string',
					commentatorInfo: {
						userId: expect.any(String),
						userLogin: login,
					},
					createdAt: entityCreatedAt,
					likesInfo: {
						likesCount: 0,
						dislikesCount: 0,
						myStatus: 'None',
					},
				},
			],
		})
	})

	it('should return 200 and comment', async () => {
		const res = await request(app).get(`${routersPaths.comments}/${commentId}`)
		expect(res.status).toEqual(200)
		expect(res.body).toEqual({
			id: commentId,
			content:
				'test stringtest stringtest stringtest stringtest stringtest string',
			commentatorInfo: {
				userId: expect.any(String),
				userLogin: login,
			},
			createdAt: entityCreatedAt,
			likesInfo: {
				likesCount: 0,
				dislikesCount: 0,
				myStatus: 'None',
			},
		})
	})

	it('should return 404, non exist comment', async () => {
		await request(app).get(`${routersPaths.comments}/2`).expect(404)
	})

	it('should return 204, update comment', async () => {
		await request(app)
			.put(`${routersPaths.comments}/${commentId}`)
			.send({
				content: 'New Test stringNew Test stringNew Test stringNew Test string',
			})
			.set('Authorization', 'bearer ' + jwtAccessToken)
			.expect(204)
	})

	it('should return 204, delete comment', async () => {
		await request(app)
			.delete(`${routersPaths.comments}/${commentId}`)
			.set('Authorization', 'bearer ' + jwtAccessToken)
			.expect(204)
	})

	it('should return 404, not found deleted comment', async () => {
		await request(app).get(`${routersPaths.comments}/${commentId}`).expect(404)
	})
})
