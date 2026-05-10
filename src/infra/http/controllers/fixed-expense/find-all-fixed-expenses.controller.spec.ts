import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/container.js', () => ({
	container: {
		findAllFixedExpenses: {
			execute: vi.fn().mockResolvedValue({ data: [{ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Rent', month: '2026-05', amount: 1500, category: 'food', necessary: true }], total: 1, page: 1, limit: 10 }),
		},
	},
}))

const fixedExpenseMock = {
	id: '123e4567-e89b-12d3-a456-426614174000',
	name: 'Rent',
	month: '2026-05',
	amount: 1500,
	category: 'food',
	necessary: true,
}

describe('GET /fixed-expenses', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 200 with valid query params', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses?page=1&limit=10',
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
					id: fixedExpenseMock.id,
					month: fixedExpenseMock.month,
					name: fixedExpenseMock.name,
					amount: fixedExpenseMock.amount,
					category: fixedExpenseMock.category,
					necessary: fixedExpenseMock.necessary,
				}),
			]),
		)
	})

	it('returns 400 when page is missing', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses?limit=10',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/fixed-expenses?limit=10')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'page' })]))
	})

	it('returns 400 when limit is missing', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses?page=1',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/fixed-expenses?page=1')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'limit' })]))
	})
})
