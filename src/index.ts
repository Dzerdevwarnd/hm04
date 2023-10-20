import { runDb } from './db'
import { app } from './setting'

const port = process.env.PORT || 3004

const startApp = async () => {
	await runDb()
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}

startApp()
