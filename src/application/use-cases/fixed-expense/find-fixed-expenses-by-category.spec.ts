import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpensesByCategoryUseCase } from './find-fixed-expenses-by-category.js'

describe('Find fixed expenses by category use case', () => {
	it('should find fixed expenses by category', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByCategory = new FindFixedExpensesByCategoryUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Stocks',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.INVESTMENT,
			necessary: false,
		})

		const subscription = await findByCategory.execute(ExpenseCategory.SUBSCRIPTION)
		expect(subscription).toHaveLength(1)
		if (!subscription) throw new Error('Fixed expense not found in test')
		expect(subscription[0].name).toBe('Rent')

		const investment = await findByCategory.execute(ExpenseCategory.INVESTMENT)
		expect(investment).toHaveLength(1)
		if (!investment) throw new Error('Fixed expense not found in test')
		expect(investment[0].name).toBe('Stocks')

		const food = await findByCategory.execute(ExpenseCategory.FOOD)
		expect(food).toHaveLength(0)
	})
})
