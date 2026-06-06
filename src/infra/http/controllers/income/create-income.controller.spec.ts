import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

// Mock do use case
vi.mock('@/main/app.js', () => ({
	container: {
		createIncome: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('POST /incomes', () => {
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
			url: '/incomes',
			payload: { name: 'Salary', month: '2026-05', amount: 5000.0 },
		})

		expect(response.statusCode).toBe(201)
	})

	it('returns 400 when name is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { month: '2026-05', amount: 5000.0 },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'name' })]))
	})

	it('returns 400 when month is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { name: 'Salary', amount: 5000.0 },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when month format is invalid', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { name: 'Salary', month: '05-2026', amount: 5000.0 },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'month' })]))
	})

	it('returns 400 when amount is missing', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { name: 'Salary', month: '2026-05' },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount is zero or negative', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { name: 'Salary', month: '2026-05', amount: -5000.0 },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'amount' })]))
	})

	it('returns 400 when amount has more than two decimal places', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/incomes',
			payload: { name: 'Salary', month: '2026-05', amount: 5000.123 },
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		// RFC 7807
		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes')
		expect(body.errors).toEqual(
			expect.arrayContaining([expect.objectContaining({ field: 'amount', message: 'Maximum 2 decimal places' })]),
		)
	})
})
