import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		login: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

describe('POST /auth/login', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => await app.close())

	it('returns 200 for valid payload', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/login',
			payload: { email: 'test@gmail.com', password: 'testpassword' },
		})

		expect(response.statusCode).toBe(200)
	})

	it('returns 400 when email is invalid', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/login',
			payload: { email: 'testgmail.com', password: 'testpassword' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/login')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]))
	})

	it('returns 400 when email is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/login',
			payload: { password: 'testpassword' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/login')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]))
	})

	it('returns 400 when password is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/login',
			payload: { email: 'test@gmail.com' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/login')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'password' })]))
	})
})
