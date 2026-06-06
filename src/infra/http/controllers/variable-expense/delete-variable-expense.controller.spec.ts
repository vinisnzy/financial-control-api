import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildApp } from '@/main/app.js'

vi.mock('@/main/app.js', () => ({
	container: {
		deleteVariableExpense: {
			execute: vi.fn().mockResolvedValue(undefined),
		},
	},
}))

const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

describe('DELETE /variable-expenses/:id', () => {
	let app: ReturnType<typeof buildApp>

	const validId = '123e4567-e89b-12d3-a456-426614174000'

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

	it('returns 204 for valid UUID', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: `/variable-expenses/${validId}`,
		})

		expect(response.statusCode).toBe(204)
	})

	it('returns 400 for invalid UUID', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/variable-expenses/not-a-uuid',
		})

		expect(response.statusCode).toBe(400)

		const body = response.json()

		expect(body.type).toBe('about:blank')
		expect(body.title).toBe('Validation Error')
		expect(body.status).toBe(400)
		expect(body.instance).toBe('/variable-expenses/not-a-uuid')
		expect(body.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'id' })]))
	})
})
