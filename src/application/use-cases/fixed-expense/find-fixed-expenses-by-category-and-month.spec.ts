import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpensesByCategoryAndMonthUseCase } from './find-fixed-expenses-by-category-and-month.js'

describe('Find fixed expenses by category and month use case', () => {
	it('should find fixed expenses by category and month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByCategoryAndMonth = new FindFixedExpensesByCategoryAndMonthUseCase(repository)

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

		const subscription = await findByCategoryAndMonth.execute(ExpenseCategory.SUBSCRIPTION, '2026-02', userId)
		expect(subscription).toHaveLength(1)
		expect(subscription[0].name).toBe('Rent')

		const investment = await findByCategoryAndMonth.execute(ExpenseCategory.INVESTMENT, '2026-02', userId)
		expect(investment).toHaveLength(1)
		expect(investment[0].name).toBe('Stocks')

		const food = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2026-02', userId)
		expect(food).toHaveLength(1)
		expect(food[0].name).toBe('Groceries')

		const none = await findByCategoryAndMonth.execute(ExpenseCategory.FOOD, '2027-01', userId)
		expect(none).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByCategoryAndMonth = new FindFixedExpensesByCategoryAndMonthUseCase(repository)

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

		const result = await findByCategoryAndMonth.execute(ExpenseCategory.SUBSCRIPTION, '2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Rent')
	})
})
