import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/container.js', () => ({
	container: {
		findIncomeById: {
			execute: vi.fn().mockResolvedValue({ id: '123e4567-e89b-12d3-a456-426614174000', name: 'Salary', month: '2026-05', amount: 5000 }),
		},
	},
}))

const incomeMock = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Salary', month: '2026-05', amount: 5000 }

describe('GET /incomes/:id', () => {
	let app: ReturnType<typeof buildApp>

	beforeAll(async () => {
		app = buildApp()
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('returns 200 for valid UUID and response body matches income data', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/incomes/123e4567-e89b-12d3-a456-426614174000',
		})

		expect(response.statusCode).toBe(200)

		const body = response.json()

		expect(body).toEqual(
			expect.objectContaining({
				id: incomeMock.id,
				name: incomeMock.name,
				month: incomeMock.month,
				amount: incomeMock.amount,
			}),
		)
	})

	it('returns 400 for invalid UUID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/incomes/not-a-uuid',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/incomes/not-a-uuid')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'id' })]))
	})
})
