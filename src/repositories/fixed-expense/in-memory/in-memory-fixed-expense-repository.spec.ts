import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from './in-memory-fixed-expense-repository.js'

describe('In memory fixed expense repository', () => {
	it('should return an empty list when find all expenses and there are no expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const expenses = await repository.findAll()

		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list all expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const expense1 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})
		const expense2 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
		})

		await repository.create(expense1)
		await repository.create(expense2)

		const expenses = await repository.findAll()

		expect(expenses).toHaveLength(2)
		expect(expenses).toEqual(expect.arrayContaining([expense1, expense2]))
	})

	it('should find expense by id', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const id = randomUUID().toString()
		const name = 'Supermarket'
		const month = '2026-02'
		const amount = 300.0
		const category = ExpenseCategory.FOOD
		const necessary = true

		await repository.create(
			new FixedExpense({
				id,
				name,
				month,
				amount,
				category,
				necessary,
			}),
		)

		const response = await repository.findById(id)

		expect(response).not.toBeNull()

		if (!response) throw new Error('Expense not found in test')

		expect(response.id).toEqual(id)
		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
		expect(response.category).toEqual(category)
		expect(response.necessary).toEqual(necessary)
	})

	it('should return null when find expense by id and there are no expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const id = randomUUID().toString()

		const response = await repository.findById(id)

		expect(response).toBeNull()
	})

	it('should return null when current expenses does not have the corresponding id', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		await repository.create(
			new FixedExpense({
				id: randomUUID().toString(),
				name: 'Supermarket',
				month: '2026-02',
				amount: 300.0,
				category: ExpenseCategory.FOOD,
				necessary: true,
			}),
		)

		const otherId = randomUUID().toString()

		const response = await repository.findById(otherId)

		expect(response).toBeNull()
	})

	it('should return an empty list when find expenses by month and there are no expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const expenses = await repository.findByMonth('2026-02')

		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list expenses by month', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const expense1 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})
		const expense2 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
		})
		const expense3 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket January',
			month: '2026-01',
			amount: 250.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})

		await repository.create(expense1)
		await repository.create(expense2)
		await repository.create(expense3)

		const expenses = await repository.findByMonth('2026-02')

		expect(expenses.every((e) => e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(2)
		expect(expenses).toEqual(expect.arrayContaining([expense1, expense2]))
	})

	it('should list expenses by category', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const expense1 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})
		const expense2 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
		})

		await repository.create(expense1)
		await repository.create(expense2)

		const expenses = await repository.findByCategory(ExpenseCategory.FOOD)

		expect(expenses.every((e) => e.category === ExpenseCategory.FOOD)).toBe(true)
		expect(expenses).toHaveLength(1)
		expect(expenses[0]).toEqual(expense1)
	})

	it('should list all necessary expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const expense1 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})
		const expense2 = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
		})

		await repository.create(expense1)
		await repository.create(expense2)

		const expenses = await repository.findAllNecessary()

		expect(expenses.every((e) => e.necessary)).toBe(true)
		expect(expenses).toHaveLength(1)
		expect(expenses[0]).toEqual(expense1)
	})

	it('should update an existing expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const id = randomUUID().toString()

		await repository.create(
			new FixedExpense({
				id,
				name: 'Supermarket',
				month: '2026-02',
				amount: 300.0,
				category: ExpenseCategory.FOOD,
				necessary: true,
			}),
		)

		const name = 'Supermarket Updated'
		const month = '2026-02'
		const amount = 350.0
		const category = ExpenseCategory.FOOD
		const necessary = true

		const expense = new FixedExpense({
			id,
			name,
			month,
			amount,
			category,
			necessary,
		})

		await repository.save(expense)
		const savedExpense = await repository.findById(id)

		if (!savedExpense) throw new Error('Expense not found in test')
		expect(savedExpense.id).toEqual(id)
		expect(savedExpense.name).toEqual(name)
		expect(savedExpense.month).toEqual(month)
		expect(savedExpense.amount).toEqual(amount)
		expect(savedExpense.category).toEqual(category)
		expect(savedExpense.necessary).toEqual(necessary)
	})

	it('should throw when trying to save an expense that does not exist', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const expense = new FixedExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})

		await expect(repository.save(expense)).rejects.toThrow()
	})

	it('should create an expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const id = randomUUID().toString()

		const expense = new FixedExpense({
			id,
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})

		await repository.create(expense)

		const expenses = await repository.findAll()

		expect(expenses).toHaveLength(1)
		expect(expenses[0].id).toEqual(id)
	})

	it('should delete an expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()

		const id = randomUUID().toString()

		const expense = new FixedExpense({
			id,
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})

		await repository.create(expense)

		await repository.delete(id)

		const expenses = await repository.findAll()

		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])

		const deletedExpense = await repository.findById(id)
		expect(deletedExpense).toBeNull()
	})
})
