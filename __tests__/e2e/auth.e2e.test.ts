import request from 'supertest'
import { app, routersPaths } from '../../src/setting'

const agent = request.agent(app)

describe('/auth', () => {
	let entityId: string
	let entityCreatedAt: string
	let cookies: any
	let refreshToken: any
	let expiredCookies: { refreshToken: string }
	const email = 'dzerdevwarnd@gmail.com'
	const login = 'string'
	const password = '123321'

	it('should return 200 and Access Token', async () => {
		const res = await agent.post(`${routersPaths.auth}/login`).send({
			loginOrEmail: email,
			password: password,
		})
		expect(res.status).toEqual(200)
		expect(res.body).toEqual({
			accessToken: expect.any(String),
		})
		cookies = res.headers['set-cookie']
		console.log(cookies[0])
		console.log(refreshToken)
		expect(cookies[0]).toEqual(
			`refreshToken=${expect.any(String)}; Path=/; HttpOnly; Secure`
		)
	}),
		it('should return 400 and Access Token', async () => {
			const res = await agent.post(`${routersPaths.auth}/login`).send({
				loginOrEmail: '',
				password: password,
			})
			expect(res.status).toEqual(400)
			expect(res.body).toEqual({
				errorsMessages: [
					{
						message: expect.any(String),
						field: 'loginOrEmail',
					},
				],
			})
		}),
		it('should return 401 and Access Token', async () => {
			const res = await agent.post(`${routersPaths.auth}/login`).send({
				loginOrEmail: 'login',
				password: `wrongPassword`,
			})
			expect(res.status).toEqual(401)
		}),
		it('should return 200 and new refresh Token in cookies', async () => {
			expiredCookies = cookies
			const res = await agent
				.post(`${routersPaths.auth}/refresh-token`)
				.set('Cookie', [cookies[0].split(' ')[0]])
				.send({})
			expect(res.status).toEqual(200)
			cookies = res.headers['set-cookie']
			expect(cookies).toEqual({ refreshToken: expect.any(String) })
		})
})
/*		it('should return 200 and User info', async () => {
			await userService.createUser({ login, password, email }) // создание пользователя
			const res = await request(app).get(`${routersPaths.auth}/me`)

			expect(res.status).toEqual(201)
			expect(res.body).toEqual({
				login: expect.any(String),
				password: expect.any(String),
				email: expect.any(String),
			})
			entityId = res.body.id
			entityCreatedAt = res.body.createdAt
			console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!${res.body.id}`)
		})

	it('should return 200 and entity pagination', async () => {
		const res = await request(app).get(`${routersPaths.blogs}/${entityId}`)
		expect(res.status).toEqual(200)
		expect(res.body).toEqual({
			id: entityId,
			name: 'Cu11r',
			description: '1',
			websiteUrl: 'cucumber.org',
			createdAt: entityCreatedAt,
			isMembership: expect.any(Boolean),
		})
	})

	it('should return 404, non exist blog', async () => {
		await request(app).get(`${routersPaths.blogs}/2`).expect(404)
	})
	it('should return 204, update blog', async () => {
		await request(app)
			.put(`${routersPaths.blogs}/${entityId}`)
			.send({
				name: 'Cu11r',
				description: '1',
				websiteUrl: 'cucumber.org',
			})
			.auth('admin', 'qwerty')
			.expect(204)
	})
	it('should return 204, delete blog', async () => {
		await request(app)
			.delete(`${routersPaths.blogs}/${entityId}`)
			.auth('admin', 'qwerty')
			.expect(204)
	})

	it('should return 404, not found deleted blog', async () => {
		await request(app).get(`${routersPaths.blogs}/${entityId}`).expect(404)
	})
})*/
