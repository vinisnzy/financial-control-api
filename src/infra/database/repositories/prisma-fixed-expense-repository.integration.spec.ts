import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { PrismaFixedExpenseRepository } from './prisma-fixed-expense-repository.js'

describe('Prisma fixed expense repository', () => {
	it('should return an empty list when find all expenses and there are no expenses', async () => {
		const repository = new PrismaFixedExpenseRepository()
		const result = await repository.findAll()

		expect(result.data).toHaveLength(0)
		expect(result.data).toEqual([])
		expect(result.total).toBe(0)
	})

	it('should list all expenses', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })

		const result = await repository.findAll()

		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
	})

	it('should paginate expenses correctly', async () => {
		const repository = new PrismaFixedExpenseRepository()

		for (let i = 1; i <= 5; i++) {
			await repository.create({
				name: `Expense ${i}`,
				month: '2026-02',
				amount: i * 100,
				category: ExpenseCategory.FOOD,
				necessary: true,
			})
		}

		const page1 = await repository.findAll({ page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await repository.findAll({ page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await repository.findAll({ page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('should find expense by id', async () => {
		const repository = new PrismaFixedExpenseRepository()

		const name = 'Supermarket'
		const month = '2026-02'
		const amount = 300.0
		const category = ExpenseCategory.FOOD
		const necessary = true

		await repository.create({ name, month, amount, category, necessary })

		const result = await repository.findAll()
		const id = result.data[0].id

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
		const repository = new PrismaFixedExpenseRepository()

		const response = await repository.findById(randomUUID())

		expect(response).toBeNull()
	})

	it('should return null when current expenses does not have the corresponding id', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const response = await repository.findById(randomUUID())

		expect(response).toBeNull()
	})

	it('should find expense by name and month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		const name = 'Supermarket'
		const month = '2026-02'
		const amount = 300.0
		const category = ExpenseCategory.FOOD
		const necessary = true

		await repository.create({ name, month, amount, category, necessary })

		const response = await repository.findByNameAndMonth(name, month)

		expect(response).not.toBeNull()

		if (!response) throw new Error('Expense not found in test')

		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
		expect(response.category).toEqual(category)
		expect(response.necessary).toEqual(necessary)
	})

	it('should return null when current expenses does not have the corresponding name', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const response = await repository.findByNameAndMonth('Restaurant', '2026-02')

		expect(response).toBeNull()
	})

	it('should return null when current expenses does not have the corresponding month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const response = await repository.findByNameAndMonth('Supermarket', '2026-03')

		expect(response).toBeNull()
	})

	it('should return an empty list when find expenses by month and there are no expenses', async () => {
		const repository = new PrismaFixedExpenseRepository()
		const expenses = await repository.findByMonth('2026-02')

		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list expenses by month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })
		await repository.create({ name: 'Supermarket January', month: '2026-01', amount: 250.0, category: ExpenseCategory.FOOD, necessary: true })

		const expenses = await repository.findByMonth('2026-02')

		expect(expenses.every((e) => e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(2)
	})

	it('should list expenses by category', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })

		const expenses = await repository.findByCategory(ExpenseCategory.FOOD)

		expect(expenses.every((e) => e.category === ExpenseCategory.FOOD)).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should list all necessary expenses', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })

		const expenses = await repository.findAllNecessary()

		expect(expenses.every((e) => e.necessary)).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should list necessary expenses by month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })
		await repository.create({ name: 'Supermarket January', month: '2026-01', amount: 250.0, category: ExpenseCategory.FOOD, necessary: true })

		const expenses = await repository.findNecessaryByMonth('2026-02')

		expect(expenses.every((e) => e.necessary && e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should return an empty list when no necessary expenses for the month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: false })

		const expenses = await repository.findNecessaryByMonth('2026-02')
		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should list expenses by category and month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })
		await repository.create({ name: 'Cinema', month: '2026-02', amount: 50.0, category: ExpenseCategory.LEISURE, necessary: false })
		await repository.create({ name: 'Supermarket January', month: '2026-01', amount: 250.0, category: ExpenseCategory.FOOD, necessary: true })

		const expenses = await repository.findByCategoryAndMonth(ExpenseCategory.FOOD, '2026-02')

		expect(expenses.every((e) => e.category === ExpenseCategory.FOOD && e.month === '2026-02')).toBe(true)
		expect(expenses).toHaveLength(1)
	})

	it('should return an empty list when no expenses for category and month', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const expenses = await repository.findByCategoryAndMonth(ExpenseCategory.LEISURE, '2026-01')
		expect(expenses).toHaveLength(0)
		expect(expenses).toEqual([])
	})

	it('should update an existing expense', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const result = await repository.findAll()
		const id = result.data[0].id

		const name = 'Supermarket Updated'
		const month = '2026-02'
		const amount = 350.0
		const category = ExpenseCategory.FOOD
		const necessary = true

		const expense = new FixedExpense({ id, name, month, amount, category, necessary })

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
		const repository = new PrismaFixedExpenseRepository()

		const expense = new FixedExpense({
			id: randomUUID(),
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})

		await expect(repository.save(expense)).rejects.toThrow()
	})

	it('should create an expense', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const result = await repository.findAll()

		expect(result.data).toHaveLength(1)
		expect(result.total).toBe(1)
	})

	it('should delete an expense', async () => {
		const repository = new PrismaFixedExpenseRepository()

		await repository.create({ name: 'Supermarket', month: '2026-02', amount: 300.0, category: ExpenseCategory.FOOD, necessary: true })

		const result = await repository.findAll()
		const id = result.data[0].id

		await repository.delete(id)

		const resultAfterDelete = await repository.findAll()

		expect(resultAfterDelete.data).toHaveLength(0)
		expect(resultAfterDelete.data).toEqual([])
		expect(resultAfterDelete.total).toBe(0)

		const deletedExpense = await repository.findById(id)
		expect(deletedExpense).toBeNull()
	})

	it('should throw if trying to delete a non-existent expense', async () => {
		const repository = new PrismaFixedExpenseRepository()
		await expect(repository.delete('non-existent-id')).rejects.toThrow('Expense not found with id: non-existent-id')
	})
})
