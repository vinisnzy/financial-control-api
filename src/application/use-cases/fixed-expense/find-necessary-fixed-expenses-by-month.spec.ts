import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindNecessaryFixedExpensesByMonthUseCase } from './find-necessary-fixed-expenses-by-month.js'

describe('Find necessary fixed expenses by month use case', () => {
	it('should find necessary fixed expenses by month', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findNecessaryByMonth = new FindNecessaryFixedExpensesByMonthUseCase(repository)

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
		await createFixedExpense.execute({
			name: 'Groceries',
			month: '2026-02',
			amount: 500,
			category: ExpenseCategory.FOOD,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Rent January',
			month: '2026-01',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const necessary = await findNecessaryByMonth.execute('2026-02')
		expect(necessary).toHaveLength(2)
		if (!necessary) throw new Error('Fixed expense not found in test')
		expect(necessary.map((e) => e.name)).toEqual(expect.arrayContaining(['Rent', 'Groceries']))

		const none = await findNecessaryByMonth.execute('2027-01')
		expect(none).toHaveLength(0)
	})
})
