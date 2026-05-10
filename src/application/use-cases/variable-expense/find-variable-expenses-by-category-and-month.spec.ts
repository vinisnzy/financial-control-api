import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByCategoryAndMonthUseCase } from './find-variable-expenses-by-category-and-month.js'

describe('Find variable expenses by category and month use case', () => {
	it('should find variable expenses by category and month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByCategoryAndMonth = new FindVariableExpensesByCategoryAndMonthUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Cinema',
			month: '2026-02',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Supermarket January',
			month: '2026-01',
			amount: 250,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 0, 10)),
			userId,
		})

		const foodFeb = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-02', userId)
		expect(foodFeb).toHaveLength(1)
		expect(foodFeb[0].name).toBe('Supermarket')

		const leisureFeb = await findByCategoryAndMonth.execute(ExpenseCategory.LEISURE, '2026-02', userId)
		expect(leisureFeb).toHaveLength(1)
		expect(leisureFeb[0].name).toBe('Cinema')

		const foodJan = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-01', userId)
		expect(foodJan).toHaveLength(1)
		expect(foodJan[0].name).toBe('Supermarket January')

		const none = await findByCategoryAndMonth.execute(ExpenseCategory.INVESTMENT, '2026-02', userId)
		expect(none).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByCategoryAndMonth = new FindVariableExpensesByCategoryAndMonthUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Other Supermarket',
			month: '2026-02',
			amount: 200,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 12)),
			userId: otherUserId,
		})

		const result = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Supermarket')
	})
})
