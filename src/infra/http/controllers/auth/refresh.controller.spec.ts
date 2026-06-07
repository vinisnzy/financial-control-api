import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		refresh: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

describe('POST /auth/refresh', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => await app.close())

	it('returns 200 to valid payload', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/refresh',
			payload: { token: 'random-refresh-token' },
		})

		expect(response.statusCode).toBe(200)
	})

	it('returns 400 when token is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/refresh',
			payload: {},
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/refresh')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'token' })]))
	})
})
