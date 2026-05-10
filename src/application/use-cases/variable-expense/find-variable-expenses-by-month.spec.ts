import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByMonthUseCase } from './find-variable-expenses-by-month.js'

describe('Find variable expenses by month use case', () => {
	it('should find variable expenses by month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByMonth = new FindVariableExpensesByMonthUseCase(repository)

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
			month: '2026-03',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 2, 11)),
			userId,
		})

		const feb = await findByMonth.execute('2026-02', userId)
		expect(feb).toHaveLength(1)
		expect(feb[0].name).toBe('Supermarket')

		const mar = await findByMonth.execute('2026-03', userId)
		expect(mar).toHaveLength(1)
		expect(mar[0].name).toBe('Cinema')
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByMonth = new FindVariableExpensesByMonthUseCase(repository)

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
			name: 'Other Expense',
			month: '2026-02',
			amount: 100,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 12)),
			userId: otherUserId,
		})

		const result = await findByMonth.execute('2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Supermarket')
	})
})
