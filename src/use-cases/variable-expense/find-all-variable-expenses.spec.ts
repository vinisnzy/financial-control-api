import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
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

		const all = await findAll.execute()
		expect(all).toHaveLength(2)
		const names = all.map((e) => e.name)
		expect(names).toContain('Supermarket')
		expect(names).toContain('Cinema')
	})
})
