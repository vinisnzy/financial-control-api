import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindAllVariableExpensesUseCase } from './find-all-variable-expenses.js'

describe('Find all variable expenses use case', () => {
	it('should find all variable expenses', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAll = new FindAllVariableExpensesUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
		})
		await createVariableExpense.execute({
			name: 'Cinema',
			month: '2026-03',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 2, 11)),
		})

		const all = await findAll.execute()
		expect(all).toHaveLength(2)
		const names = all.map((e) => e.name)
		expect(names).toContain('Supermarket')
		expect(names).toContain('Cinema')
	})
})
