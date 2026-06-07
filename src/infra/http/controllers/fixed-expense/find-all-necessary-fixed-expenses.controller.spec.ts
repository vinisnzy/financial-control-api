import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		findAllNecessaryFixedExpenses: {
			execute: vi
				.fn()
				.mockResolvedValue([
					{
						id: '123e4567-e89b-12d3-a456-426614174000',
						name: 'Rent',
						month: '2026-05',
						amount: 1500,
						category: 'food',
						necessary: true,
					},
				]),
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

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'
const USER_EMAIL = 'user@gmail.com'

describe('GET /fixed-expenses/necessary', () => {
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

	it('returns 200 and body is array with mapped fixed expense data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/fixed-expenses/necessary',
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
})
