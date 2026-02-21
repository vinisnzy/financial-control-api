import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpensesByMonthUseCase } from './find-fixed-expenses-by-month.js'

describe('Find fixed expenses by month use case', () => {
	it('should find fixed expenses by month', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByMonth = new FindFixedExpensesByMonthUseCase(repository)

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

		const feb = await findByMonth.execute('2026-02')
		expect(feb).toHaveLength(2)
		const mar = await findByMonth.execute('2026-03')
		expect(mar).toHaveLength(1)
		const apr = await findByMonth.execute('2026-04')
		expect(apr).toHaveLength(0)
	})
})
