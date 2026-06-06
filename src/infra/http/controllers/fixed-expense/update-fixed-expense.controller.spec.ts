import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/app.js', () => ({
	container: {
		updateFixedExpense: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('PUT /fixed-expenses/:id', () => {
	let app: ReturnType<typeof buildApp>

	const validId = '123e4567-e89b-12d3-a456-426614174000'
	const validBody = { month: '2026-05', name: 'Rent', amount: 1500, category: 'food', necessary: true }

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

	it('returns 204 for valid payload', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: validBody,
		})

		expect(response.statusCode).toBe(204)
	})

	it('returns 400 when id is not a valid UUID', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: '/fixed-expenses/not-a-uuid',
			payload: validBody,
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/fixed-expenses/not-a-uuid')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'id' })]))
	})

	it('returns 400 when month is missing', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { name: 'Rent', amount: 1500, category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when month format is invalid', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '05-2026', name: 'Rent', amount: 1500, category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when name is missing', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', amount: 1500, category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'name' })]))
	})

	it('returns 400 when amount is missing', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount is zero or negative', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', amount: -1500, category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount has more than two decimal places', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', amount: 1500.123, category: 'food', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'amount', message: 'Maximum 2 decimal places' })]),
		)
	})

	it('returns 400 when category is missing', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', amount: 1500, necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})

	it('returns 400 when category is invalid', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', amount: 1500, category: 'invalid', necessary: true },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})

	it('returns 400 when necessary is missing', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: `/fixed-expenses/${validId}`,
			payload: { month: '2026-05', name: 'Rent', amount: 1500, category: 'food' },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe(`/fixed-expenses/${validId}`)
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'necessary' })]))
	})
})
