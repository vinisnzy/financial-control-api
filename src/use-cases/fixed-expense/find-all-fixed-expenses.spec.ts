import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindAllFixedExpensesUseCase } from './find-all-fixed-expenses.js'

describe('Find all fixed expenses use case', () => {
	it('should find all fixed expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findAll = new FindAllFixedExpensesUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Internet',
			month: '2026-03',
			amount: 100,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const all = await findAll.execute()
		expect(all).toHaveLength(2)
		const names = all.map((e) => e.name)
		expect(names).toContain('Rent')
		expect(names).toContain('Internet')
	})
})
