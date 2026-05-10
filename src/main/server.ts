import { buildApp } from './app.js'

const app = buildApp()

const port = Number(process.env.PORT) || 3333

app.listen({ port }).then(() => {
	console.log(`🔥 Http server running on port: ${port} 🔥`)
})
