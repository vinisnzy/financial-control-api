import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { ExpenseCategory } from '@/enums/expense-category.js'
import { FixedExpense } from './fixed-expense.js'

describe('Fixed expense entity', () => {
	it('should be create an fixed expense', () => {
		const fixedExpense = new FixedExpense({
			id: randomUUID().toString(),
			month: '2026-02',
			name: 'Internet',
			amount: 45.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		expect(fixedExpense).toBeInstanceOf(FixedExpense)
		expect(fixedExpense.month).toEqual('2026-02')
		expect(fixedExpense.name).toEqual('Internet')
		expect(fixedExpense.amount).toEqual(45.0)
		expect(fixedExpense.category).toEqual(ExpenseCategory.SUBSCRIPTION)
		expect(fixedExpense.necessary).toEqual(true)
	})

	it('should not be able create an fixed expense with name blank', () => {
		expect(() => {
			return new FixedExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: '',
				amount: 45.0,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			})
		}).toThrow()
	})

	it('should not be able create an fixed expense with month blank', () => {
		expect(() => {
			return new FixedExpense({
				id: randomUUID().toString(),
				month: '',
				name: 'Internet',
				amount: 45.0,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			})
		}).toThrow()
	})

	it('should not be able create an fixed expense with amount negative', () => {
		expect(() => {
			return new FixedExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: 'Internet',
				amount: -45.0,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			})
		}).toThrow()
	})

	it('should not be able create an fixed expense with amount equals to zero', () => {
		expect(() => {
			return new FixedExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: 'Internet',
				amount: 0,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			})
		}).toThrow()
	})
})
