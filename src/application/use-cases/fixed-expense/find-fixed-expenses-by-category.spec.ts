import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpensesByCategoryUseCase } from './find-fixed-expenses-by-category.js'

describe('Find fixed expenses by category use case', () => {
	it('should find fixed expenses by category', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByCategory = new FindFixedExpensesByCategoryUseCase(repository)

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

		const subscription = await findByCategory.execute(ExpenseCategory.SUBSCRIPTION, userId)
		expect(subscription).toHaveLength(1)
		expect(subscription[0].name).toBe('Rent')

		const investment = await findByCategory.execute(ExpenseCategory.INVESTMENT, userId)
		expect(investment).toHaveLength(1)
		expect(investment[0].name).toBe('Stocks')

		const food = await findByCategory.execute(ExpenseCategory.FOOD, userId)
		expect(food).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findByCategory = new FindFixedExpensesByCategoryUseCase(repository)

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

		const result = await findByCategory.execute(ExpenseCategory.SUBSCRIPTION, userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Rent')
	})
})
