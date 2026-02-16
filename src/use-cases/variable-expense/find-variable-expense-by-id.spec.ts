import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpenseByIdUseCase } from './find-variable-expense-by-id.js'

describe('Find variable expense by id use case', () => {
	it('should find variable expense by id', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findById = new FindVariableExpenseByIdUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})
		const expense = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		const found = await findById.execute(expense.id)
		expect(found).not.toBeNull()
		if (!found) throw new Error('Expense not found in test')
		expect(found.name).toBe('Supermarket')
	})

	it('should return null if variable expense id does not exist', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const findById = new FindVariableExpenseByIdUseCase(repository)
		const found = await findById.execute('non-existent-id')
		expect(found).toBeNull()
	})
})
