import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { Income } from './income.js'

describe('Income entity', () => {
	it('should be create an income', () => {
		const income = new Income({
			id: randomUUID().toString(),
			month: '2026-02',
			amount: 2000.0,
		})

		expect(income).toBeInstanceOf(Income)
		expect(income.month).toEqual('2026-02')
		expect(income.amount).toEqual(2000.0)
	})

	it('should not be able to create a income with month blank', () => {
		expect(() => {
			return new Income({
				id: randomUUID().toString(),
				month: '',
				amount: 2000.0,
			})
		}).toThrow()
	})

	it('should not be able to create a income with negative amount', () => {
		expect(() => {
			return new Income({
				id: randomUUID().toString(),
				month: '2026-02',
				amount: -2000.0,
			})
		}).toThrow()
	})

	it('should not be able to create a income with amount equal to zero', () => {
		expect(() => {
			return new Income({
				id: randomUUID().toString(),
				month: '2026-02',
				amount: 0,
			})
		}).toThrow()
	})
})
