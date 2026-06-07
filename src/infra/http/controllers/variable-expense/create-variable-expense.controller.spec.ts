import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		createVariableExpense: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('POST /variable-expenses', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		app.addHook('onRequest', async (request) => {
			request.user = { sub: USER_ID }
		})
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 201 for valid payload', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(201)
	})

	it('returns 201 for valid payload with date', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10, category: 'food', necessary: false, date: '2026-05-01' },
		})

		expect(response.statusCode).toBe(201)
	})

	it('returns 400 when month is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { name: 'Coffee', amount: 10, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when month format is invalid', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '05-2026', name: 'Coffee', amount: 10, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when name is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', amount: 10, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'name' })]))
	})

	it('returns 400 when amount is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount is zero or negative', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: -10, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount has more than two decimal places', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10.123, category: 'food', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'amount', message: 'Maximum 2 decimal places' })]),
		)
	})

	it('returns 400 when category is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10, necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})

	it('returns 400 when category is invalid', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10, category: 'invalid-category', necessary: false },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})

	it('returns 400 when necessary is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/variable-expenses',
			payload: { month: '2026-05', name: 'Coffee', amount: 10, category: 'food' },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'necessary' })]))
	})
})
