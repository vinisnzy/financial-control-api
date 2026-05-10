import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindAllNecessaryVariableExpensesUseCase } from './find-all-necessary-variable-expenses.js'

describe('Find all necessary variable expenses use case', () => {
	it('should find all necessary variable expenses', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAllNecessary = new FindAllNecessaryVariableExpensesUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Cinema',
			month: '2026-03',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 2, 11)),
			userId,
		})

		const necessary = await findAllNecessary.execute(userId)
		expect(necessary).toHaveLength(1)
		expect(necessary[0].name).toBe('Supermarket')
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAllNecessary = new FindAllNecessaryVariableExpensesUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Other Supermarket',
			month: '2026-02',
			amount: 200,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 12)),
			userId: otherUserId,
		})

		const result = await findAllNecessary.execute(userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Supermarket')
	})
})
