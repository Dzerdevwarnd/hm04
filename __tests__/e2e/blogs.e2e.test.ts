import request from 'supertest'
import { app, routersPaths } from '../../src/setting'

describe('/blogs', () => {
	let entityId: string
	let entityCreatedAt: string
	it('should delete all data', () => {
		request(app).delete(`${routersPaths.testing}/all-data`).expect(204)
	})

	it('should return 201 and one entity object', async () => {
		const res = await request(app)
			.post(routersPaths.blogs)
			.send({
				name: 'Cu11r',
				description: '1',
				websiteUrl: 'cucumber.org',
			})
			.auth('admin', 'qwerty')
		expect(res.status).toEqual(201)
		expect(res.body).toEqual({
			id: expect.any(String),
			name: 'Cu11r',
			description: '1',
			websiteUrl: 'cucumber.org',
			createdAt: expect.any(String),
			isMembership: expect.any(Boolean),
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
})
