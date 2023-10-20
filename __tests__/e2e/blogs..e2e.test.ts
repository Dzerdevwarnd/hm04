import request from 'supertest'
import { app } from '../../src/setting'

describe('/blogs', () => {
	it('should return 200 and array', async () => {
		await request(app)
			.get('/blogs')
			.expect(200, [
				{
					id: 1,
					name: 'test',
					description: 'testBlog',
					websiteUrl: 'Cucumber.org',
				},
			])
	})
	it('should return 404', async () => {
		await request(app).get('/blogs/2').expect(404)
	})
	it('should return 204', async () => {
		await request(app)
			.put('/blogs/1')
			.send({
				name: 'Cu11r',
				description: '1',
				websiteUrl: 'cucumber.org',
			})
			.auth('admin', 'qwerty')
			.expect(204)
	})
	it('should return 204', async () => {
		await request(app).delete('/blogs/1').auth('admin', 'qwerty').expect(204)
	})

	it('should return 404', async () => {
		await request(app).get('/blogs/1').expect(404)
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
