import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from './in-memory-variable-expense-repository.js'

const USER_ID = randomUUID()

describe('In memory variable expense repository', () => {
	it('should return an empty list when find all expenses and there are no expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(0)
		expect(result.data).toEqual([])
		expect(result.total).toBe(0)
	})

	it('should list all expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
	})

	it('should paginate expenses correctly', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		for (let i = 1; i <= 5; i++) {
			await repository.create({
				name: `Expense ${i}`,
				month: '2026-02',
				amount: i * 100,
				category: ExpenseCategory.FOOD,
				necessary: true,
				date: new Date(Date.UTC(2026, 1, i)),
				userId: USER_ID,
			}, USER_ID)
		}

		const page1 = await repository.findAll(USER_ID, { page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await repository.findAll(USER_ID, { page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await repository.findAll(USER_ID, { page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('should find expense by id', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const name = 'Supermarket'
		const month = '2026-02'
		const amount = 300.0
		const category = ExpenseCategory.FOOD
		const necessary = true
		const date = new Date(Date.UTC(2026, 1, 10))

		await repository.create({
			name,
			month,
			amount,
			category,
			necessary,
			date,
			userId: USER_ID,
		}, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const response = await repository.findById(id, USER_ID)

		expect(response).not.toBeNull()

		if (!response) throw new Error('Expense not found in test')

		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
		expect(response.category).toEqual(category)
		expect(response.necessary).toEqual(necessary)
		expect(response.date).toEqual(date)
	})

	it('should return null when find expense by id and there are no expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const id = randomUUID().toString()

		const response = await repository.findById(id, USER_ID)

		expect(response).toBeNull()
	})

	it('should return null when current expenses does not have the corresponding id', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		await repository.create({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}, USER_ID)

		const otherId = randomUUID().toString()

		const response = await repository.findById(otherId, USER_ID)

		expect(response).toBeNull()
	})

	it('should return an empty list when find expenses by month and there are no expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const expenses = await repository.findByMonth('2026-02', USER_ID)

		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list expenses by month', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId: USER_ID,
		}
		const expense3 = {
			name: 'Supermarket January',
			month: '2026-01',
			amount: 250.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)
		await repository.create(expense3, USER_ID)

		const expenses = await repository.findByMonth('2026-02', USER_ID)

		expect(expenses.every((e) => e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(2)
	})

	it('should list expenses by category', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)

		const expenses = await repository.findByCategory(ExpenseCategory.FOOD, USER_ID)

		expect(expenses.every((e) => e.category === ExpenseCategory.FOOD)).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should list all necessary expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)

		const expenses = await repository.findAllNecessary(USER_ID)

		expect(expenses.every((e) => e.necessary)).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should list necessary expenses by month', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId: USER_ID,
		}
		const expense3 = {
			name: 'Supermarket January',
			month: '2026-01',
			amount: 250.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)
		await repository.create(expense3, USER_ID)

		const expenses = await repository.findNecessaryByMonth('2026-02', USER_ID)

		expect(expenses.every((e) => e.necessary && e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should return an empty list when no necessary expenses for the month', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)

		const expenses = await repository.findNecessaryByMonth('2026-02', USER_ID)
		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list expenses by category and month', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		const expense2 = {
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId: USER_ID,
		}
		const expense3 = {
			name: 'Supermarket January',
			month: '2026-01',
			amount: 250.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)
		await repository.create(expense2, USER_ID)
		await repository.create(expense3, USER_ID)

		const expenses = await repository.findByCategoryAndMonth(ExpenseCategory.FOOD, '2026-02', USER_ID)

		expect(expenses.every((e) => e.category === ExpenseCategory.FOOD && e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should return an empty list when no expenses for category and month', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense1 = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}
		await repository.create(expense1, USER_ID)

		const expenses = await repository.findByCategoryAndMonth(ExpenseCategory.LEISURE, '2026-01', USER_ID)
		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should update an existing expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		await repository.create({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}, USER_ID)
		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const name = 'Supermarket Updated'
		const month = '2026-02'
		const amount = 350.0
		const category = ExpenseCategory.FOOD
		const necessary = true
		const date = new Date(Date.UTC(2026, 1, 12))

		const expense = new VariableExpense({
			id,
			name,
			month,
			amount,
			category,
			necessary,
			date,
			userId: USER_ID,
		})

		await repository.save(expense, USER_ID)
		const savedExpense = await repository.findById(id, USER_ID)

		if (!savedExpense) throw new Error('Expense not found in test')
		expect(savedExpense.id).toEqual(id)
		expect(savedExpense.name).toEqual(name)
		expect(savedExpense.month).toEqual(month)
		expect(savedExpense.amount).toEqual(amount)
		expect(savedExpense.category).toEqual(category)
		expect(savedExpense.necessary).toEqual(necessary)
		expect(savedExpense.date).toEqual(date)
	})

	it('should throw when trying to save an expense that does not exist', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense = new VariableExpense({
			id: randomUUID().toString(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		})

		await expect(repository.save(expense, USER_ID)).rejects.toThrow()
	})

	it('should create an expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}

		await repository.create(expense, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(1)
		expect(result.total).toBe(1)
	})

	it('should delete an expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()

		const expense = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId: USER_ID,
		}

		await repository.create(expense, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		await repository.delete(id, USER_ID)

		const resultAfterDelete = await repository.findAll(USER_ID)

		expect(resultAfterDelete.data).toHaveLength(0)
		expect(resultAfterDelete.data).toEqual([])
		expect(resultAfterDelete.total).toBe(0)

		const deletedExpense = await repository.findById(id, USER_ID)
		expect(deletedExpense).toBeNull()
	})

	it('should throw if trying to delete a non-existent variable expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		await expect(repository.delete('non-existent-id', USER_ID)).rejects.toThrow('Expense not found with id: non-existent-id')
	})
})
