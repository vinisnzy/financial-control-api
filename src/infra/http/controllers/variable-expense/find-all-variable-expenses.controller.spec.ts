import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

const variableExpenseMock = {
	id: '123e4567-e89b-12d3-a456-426614174000',
	name: 'Coffee',
	month: '2026-05',
	amount: 10,
	category: 'food',
	necessary: false,
	date: new Date('2026-05-01'),
}

vi.mock('@/main/server.js', () => ({
	container: {
		findAllVariableExpenses: {
			execute: vi
				.fn()
				.mockResolvedValue({
					data: [
						{
							id: '123e4567-e89b-12d3-a456-426614174000',
							name: 'Coffee',
							month: '2026-05',
							amount: 10,
							category: 'food',
							necessary: false,
							date: new Date('2026-05-01'),
						},
					],
					total: 1,
					page: 1,
					limit: 10,
				}),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('GET /variable-expenses', () => {
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

	it('returns 200 with valid query params', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/variable-expenses?page=1&limit=10',
		})

		expect(response.statusCode).toBe(200)

		const body = response.json()

		expect(body.total).toBe(1)
		expect(body.page).toBe(1)
		expect(body.limit).toBe(10)
		expect(Array.isArray(body.data)).toBe(true)
		expect(body.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: variableExpenseMock.id,
					name: variableExpenseMock.name,
					month: variableExpenseMock.month,
					amount: variableExpenseMock.amount,
					category: variableExpenseMock.category,
					necessary: variableExpenseMock.necessary,
					date: variableExpenseMock.date.toISOString(),
				}),
			]),
		)
	})

	it('returns 400 when page is missing', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/variable-expenses?limit=10',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses?limit=10')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'page' })]))
	})

	it('returns 400 when limit is missing', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/variable-expenses?page=1',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses?page=1')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'limit' })]))
	})
})
