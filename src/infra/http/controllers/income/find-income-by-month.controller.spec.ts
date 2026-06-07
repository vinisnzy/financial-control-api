import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/server.js', () => ({
	container: {
		findIncomeByMonth: {
			execute: vi
				.fn()
				.mockResolvedValue([
					{ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Salary', month: '2026-05', amount: 5000 },
				]),
		},
	},
}))

const incomeMock = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Salary', month: '2026-05', amount: 5000 }

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'
const USER_EMAIL = 'user@gmail.com'

describe('GET /incomes/month/:month', () => {
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

	it('returns 200 for valid month format and response is array containing income data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/incomes/month/2026-05',
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
					id: incomeMock.id,
					name: incomeMock.name,
					month: incomeMock.month,
					amount: incomeMock.amount,
				}),
			]),
		)
	})

	it('returns 400 when month format is invalid', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/incomes/month/05-2026',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes/month/05-2026')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})
})
