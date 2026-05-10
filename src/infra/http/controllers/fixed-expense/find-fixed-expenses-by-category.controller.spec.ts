import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/container.js', () => ({
	container: {
		findFixedExpensesByCategory: {
			execute: vi.fn().mockResolvedValue([{ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Rent', month: '2026-05', amount: 1500, category: 'food', necessary: true }]),
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

describe('GET /fixed-expenses/category/:category', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 200 for valid category and body is array with fixed expense data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses/category/food',
		})

		expect(response.statusCode).toBe(200)

		const body = response.json()

		expect(Array.isArray(body)).toBe(true)
		expect(body).toEqual(
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

	it('returns 400 for invalid category', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses/category/invalid',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/fixed-expenses/category/invalid')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})
})
