import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpensesByCategoryUseCase } from './find-variable-expense-by-category.js'

describe('Find variable expenses by category use case', () => {
	it('should find variable expenses by category', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findByCategory = new FindVariableExpensesByCategoryUseCase(repository)

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

		const food = await findByCategory.execute(ExpenseCategory.FOOD)
		expect(food).toHaveLength(1)
		expect(food[0].name).toBe('Supermarket')

		const leisure = await findByCategory.execute(ExpenseCategory.LEISURE)
		expect(leisure).toHaveLength(1)
		expect(leisure[0].name).toBe('Cinema')
	})
})
