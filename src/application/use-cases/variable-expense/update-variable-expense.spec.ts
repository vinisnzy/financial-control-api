import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { UpdateVariableExpenseUseCase } from './update-variable-expense.js'

describe('Update variable expense use case', () => {
	it('should update an existing variable expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const updateVariableExpense = new UpdateVariableExpenseUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
		})

		const expense = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await updateVariableExpense.execute(expense.id, {
			name: 'Supermarket Updated',
			month: '2026-02',
			amount: 350.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
		})

		const updated = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket Updated')
		expect(updated).not.toBeNull()
		if (!updated) throw new Error('Expense not found in test')
		expect(updated.amount).toBe(350.0)
	})
})
