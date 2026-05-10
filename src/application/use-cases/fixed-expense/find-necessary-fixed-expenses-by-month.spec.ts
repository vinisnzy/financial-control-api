import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindNecessaryFixedExpensesByMonthUseCase } from './find-necessary-fixed-expenses-by-month.js'

describe('Find necessary fixed expenses by month use case', () => {
	it('should find necessary fixed expenses by month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findNecessaryByMonth = new FindNecessaryFixedExpensesByMonthUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})
		await createFixedExpense.execute({
			name: 'Stocks',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.INVESTMENT,
			necessary: false,
			userId,
		})
		await createFixedExpense.execute({
			name: 'Groceries',
			month: '2026-02',
			amount: 500,
			category: ExpenseCategory.FOOD,
			necessary: true,
			userId,
		})
		await createFixedExpense.execute({
			name: 'Rent January',
			month: '2026-01',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})

		const necessary = await findNecessaryByMonth.execute('2026-02', userId)
		expect(necessary).toHaveLength(2)
		expect(necessary.map((e) => e.name)).toEqual(expect.arrayContaining(['Rent', 'Groceries']))

		const none = await findNecessaryByMonth.execute('2027-01', userId)
		expect(none).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findNecessaryByMonth = new FindNecessaryFixedExpensesByMonthUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})
		await createFixedExpense.execute({
			name: 'Other Rent',
			month: '2026-02',
			amount: 800,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId: otherUserId,
		})

		const result = await findNecessaryByMonth.execute('2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Rent')
	})
})
