import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindAllNecessaryFixedExpensesUseCase } from './find-all-necessary-fixed-expenses.js'

describe('Find all necessary fixed expenses use case', () => {
	it('should find all necessary fixed expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findAllNecessary = new FindAllNecessaryFixedExpensesUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Internet',
			month: '2026-02',
			amount: 100,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Gym',
			month: '2026-03',
			amount: 80,
			category: ExpenseCategory.LEISURE,
			necessary: false,
		})

		const necessary = await findAllNecessary.execute()
		expect(necessary).toHaveLength(2)
		const names = necessary.map((e) => e.name)
		expect(names).toContain('Rent')
		expect(names).toContain('Internet')
	})
})
