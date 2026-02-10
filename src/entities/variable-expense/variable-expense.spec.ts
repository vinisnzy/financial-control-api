import { randomUUID } from 'node:crypto'

import { describe, expect, it } from 'vitest'

import { ExpenseCategory } from '@/enums/expense-category.js'
import { VariableExpense } from './variable-expense.js'

describe('Variable expense entity', () => {
	it('should be create an variable expense', () => {
		const variableExpense = new VariableExpense({
			id: randomUUID().toString(),
			month: '2026-02',
			name: 'Uber',
			amount: 25.0,
			category: ExpenseCategory.TRANSPORT,
			necessary: true,
			date: '2026-02-15',
		})

		expect(variableExpense).toBeInstanceOf(VariableExpense)
		expect(variableExpense.month).toEqual('2026-02')
		expect(variableExpense.name).toEqual('Uber')
		expect(variableExpense.amount).toEqual(25.0)
		expect(variableExpense.category).toEqual(ExpenseCategory.TRANSPORT)
		expect(variableExpense.necessary).toEqual(true)
	})

	it('should not be able create an variable expense with name blank', () => {
		expect(() => {
			return new VariableExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: '',
				amount: 25.0,
				category: ExpenseCategory.TRANSPORT,
				necessary: true,
				date: '2026-02-15',
			})
		}).toThrow()
	})

	it('should not be able create an variable expense with month blank', () => {
		expect(() => {
			return new VariableExpense({
				id: randomUUID().toString(),
				month: '',
				name: 'Uber',
				amount: 25.0,
				category: ExpenseCategory.TRANSPORT,
				necessary: true,
				date: '2026-02-15',
			})
		}).toThrow()
	})

	it('should not be able create an variable expense with amount negative', () => {
		expect(() => {
			return new VariableExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: 'Uber',
				amount: -25.0,
				category: ExpenseCategory.TRANSPORT,
				necessary: true,
				date: '2026-02-15',
			})
		}).toThrow()
	})

	it('should not be able create an variable expense with amount equals to zero', () => {
		expect(() => {
			return new VariableExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: 'Uber',
				amount: 0,
				category: ExpenseCategory.TRANSPORT,
				necessary: true,
				date: '2026-02-15',
			})
		}).toThrow()
	})

	it('should not be able create an variable expense with date blank', () => {
		expect(() => {
			return new VariableExpense({
				id: randomUUID().toString(),
				month: '2026-02',
				name: 'Uber',
				amount: 25.0,
				category: ExpenseCategory.TRANSPORT,
				necessary: true,
				date: '',
			})
		}).toThrow()
	})
})
