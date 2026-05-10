import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindNecessaryVariableExpensesByMonthUseCase } from './find-necessary-variable-expenses-by-month.js'

describe('Find necessary variable expenses by month use case', () => {
	it('should find necessary variable expenses by month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findNecessaryByMonth = new FindNecessaryVariableExpensesByMonthUseCase(repository)

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

		const necessaryFeb = await findNecessaryByMonth.execute('2026-02', userId)
		expect(necessaryFeb).toHaveLength(1)
		expect(necessaryFeb[0].name).toBe('Supermarket')

		const necessaryJan = await findNecessaryByMonth.execute('2026-01', userId)
		expect(necessaryJan).toHaveLength(1)
		expect(necessaryJan[0].name).toBe('Supermarket January')

		const necessaryMar = await findNecessaryByMonth.execute('2026-03', userId)
		expect(necessaryMar).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findNecessaryByMonth = new FindNecessaryVariableExpensesByMonthUseCase(repository)

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

		const result = await findNecessaryByMonth.execute('2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Supermarket')
	})
})
