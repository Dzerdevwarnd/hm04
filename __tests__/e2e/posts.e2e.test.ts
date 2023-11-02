import request from 'supertest'
import { app, routersPaths } from '../../src/setting'

describe('/posts', () => {
	it('should return 200 and array', async () => {
		await request(app).get(routersPaths.posts).expect(200, {
			pagesCount: 0,
			page: 1,
			pageSize: 10,
			totalCount: 0,
			items: [],
		})
	})
	it('should return 404', async () => {
		await request(app).get(routersPaths.posts).expect(404)
	})
	it('should return 204', async () => {
		await request(app)
			.put('/posts/1')
			.send({
				title: 'string',
				shortDescription: 'string',
				content: 'string',
				blogId: 'string',
			})
			.auth('admin', 'qwerty')
			.expect(204)
	})
	it('should return 204', async () => {
		await request(app).delete('/posts/1').auth('admin', 'qwerty').expect(204)
	})

	it('should return 404', async () => {
		await request(app).get('/posts/1').expect(404)
	})
	/*it('should return 201 and array', async () => {
		await request(app)
			.post('/blogs')
			.send({
				name: 'Cu11r',
				description: '1',
				websiteUrl: 'cucumber.org',
			})
			.auth('admin', 'qwerty')
			.expect(201, [
				{
					id: expect.anything(),
					name: 'Cu11r',
					description: '1',
					websiteUrl: 'cucumber.org',
				},
			])
	})
*/
})
