import mongoose from 'mongoose'
import request from 'supertest'
import { blogsRepository } from '../../src/repositories/blogsRepository'
import { blogsService } from '../../src/services/blogsService'
import { app, routersPaths, settings } from '../../src/setting'

describe('/posts', () => {
	beforeAll(async () => {
		/* Connecting to the database. */
		await mongoose.connect(settings.MONGO_URL)
	})

	afterAll(async () => {
		/* Closing database connection after each test. */
		await mongoose.connection.close()
	})
	let entityId: string
	let entityCreatedAt: string
	let blogId = ''

	it('should return 201 and one entity object', async () => {
		blogsService.createBlog({
			name: 'Cu11r',
			description: '1',
			websiteUrl: 'cucumber.org',
		})
		blogId = (await blogsRepository.returnAllBlogs('')).items[0].id
		const res = await request(app)
			.post(routersPaths.posts)
			.send({
				title: '1234123',
				shortDescription: 'string',
				content: 'фывыфвыфвыф',
				blogId: blogId,
			})
			.auth('admin', 'qwerty')
		expect(res.status).toEqual(201)
		expect(res.body).toEqual({
			id: expect.any(String),
			title: '1234123',
			shortDescription: 'string',
			content: 'фывыфвыфвыф',
			blogId: blogId,
			blogName: '',
			createdAt: expect.any(String),
		})
		entityId = res.body.id
		entityCreatedAt = res.body.createdAt
	})

	it('should return 200 and entity pagination', async () => {
		const res = await request(app).get(`${routersPaths.posts}/${entityId}`)
		expect(res.status).toEqual(200)
		expect(res.body).toEqual({
			id: entityId,
			title: '1234123',
			shortDescription: 'string',
			content: 'фывыфвыфвыф',
			blogId: blogId,
			blogName: '',
			createdAt: entityCreatedAt,
		})
	})

	it('should return 404, non exist post', async () => {
		await request(app).get(`${routersPaths.blogs}/2`).expect(404)
	})
	it('should return 204, update blog', async () => {
		await request(app)
			.put(`${routersPaths.posts}/${entityId}`)
			.send({
				title: 'updated',
				shortDescription: 'updated',
				content: 'updated',
				blogId: blogId,
			})
			.auth('admin', 'qwerty')
			.expect(204)
	})
	it('should return 204, delete post', async () => {
		await request(app)
			.delete(`${routersPaths.posts}/${entityId}`)
			.auth('admin', 'qwerty')
			.expect(204)
	})

	it('should return 404, not found deleted blog', async () => {
		await request(app).get(`${routersPaths.posts}/${entityId}`).expect(404)
	})
})
