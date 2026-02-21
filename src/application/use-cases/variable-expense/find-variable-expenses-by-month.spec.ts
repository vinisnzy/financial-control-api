import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByMonthUseCase } from './find-variable-expenses-by-month.js'

describe('Find variable expenses by month use case', () => {
	it('should find variable expenses by month', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByMonth = new FindVariableExpensesByMonthUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})
		await createVariableExpense.execute({
			name: 'Cinema',
			month: '2026-03',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: '2026-03-11',
		})

		const feb = await findByMonth.execute('2026-02')
		expect(feb).toHaveLength(1)
		expect(feb[0].name).toBe('Supermarket')

		const mar = await findByMonth.execute('2026-03')
		expect(mar).toHaveLength(1)
		expect(mar[0].name).toBe('Cinema')
	})
})
