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
		findVariableExpenseByCategory: {
			execute: vi
				.fn()
				.mockResolvedValue([
					{
						id: '123e4567-e89b-12d3-a456-426614174000',
						name: 'Coffee',
						month: '2026-05',
						amount: 10,
						category: 'food',
						necessary: false,
						date: new Date('2026-05-01'),
					},
				]),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'
const USER_EMAIL = 'user@gmail.com'

describe('GET /variable-expenses/category/:category', () => {
	let app: ReturnType<typeof buildApp>
	let token: string

	beforeAll(async () => {
		app = buildApp()
		await app.ready()

		token = app.jwt.sign({ sub: USER_ID, email: USER_EMAIL })
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 200 for valid category and body is array with variable expense data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/variable-expenses/category/food',
			headers: {
				authorization: `Bearer ${token}`
			}
		})

		expect(response.statusCode).toBe(200)

		const body = response.json()

		expect(Array.isArray(body)).toBe(true)
		expect(body).toEqual(
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

	it('returns 400 for invalid category', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/variable-expenses/category/invalid-category',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses/category/invalid-category')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'category' })]))
	})
})
