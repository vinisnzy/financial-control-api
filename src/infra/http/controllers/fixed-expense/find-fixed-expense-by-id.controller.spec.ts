import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/container.js', () => ({
	container: {
		findFixedExpenseById: {
			execute: vi.fn().mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Rent', month: '2026-05', amount: 1500, category: 'food', necessary: true }),
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

describe('GET /fixed-expenses/:id', () => {
	let app: ReturnType<typeof buildApp>

	const validId = '123e4567-e89b-12d3-a456-426614174000'

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 200 for valid UUID and body matches fixed expense data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/fixed-expenses/${validId}`,
		})

		expect(response.statusCode).toBe(200)

		const body = response.json()

		expect(body).toMatchObject({
			id: fixedExpenseMock.id,
			month: fixedExpenseMock.month,
			name: fixedExpenseMock.name,
			amount: fixedExpenseMock.amount,
			category: fixedExpenseMock.category,
			necessary: fixedExpenseMock.necessary,
		})
	})

	it('returns 400 for invalid UUID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses/not-a-uuid',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/fixed-expenses/not-a-uuid')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'id' })]))
	})
})
