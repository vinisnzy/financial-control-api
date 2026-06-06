import { buildApp } from './app.js'
import { createContainer } from './container.js'

const app = buildApp()

export const container = createContainer(app)

const port = Number(process.env.PORT) || 3333

app.listen({ port }).then(() => {
	console.log(`🔥 Http server running on port: ${port} 🔥`)
})
