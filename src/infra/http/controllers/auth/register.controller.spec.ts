import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		register: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

describe('POST /auth/register', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => await app.close())

	it('returns 201 for valid payload', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/register',
			payload: { email: 'test@gmail.com', password: 'testpassword', name: 'Test user' },
		})

		expect(response.statusCode).toBe(201)
	})

	it('returns 400 when email is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/register',
			payload: { password: 'testpassword', name: 'Test user' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/register')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]))
	})

	it('returns 400 when email is invalid', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/register',
			payload: { email: 'testgmail', password: 'testpassword', name: 'Test user' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/register')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'email' })]))
	})

	it('returns 400 when password is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/register',
			payload: { email: 'test@gmail.com', name: 'Test user' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/register')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'password' })]))
	})

	it('returns 400 when name is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/auth/register',
			payload: { email: 'test@gmail.com', password: 'testpassword' },
		})

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/auth/register')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'name' })]))
	})
})
