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
			date: '2026-02-10',
		})

		const expense = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await updateVariableExpense.execute(expense.id, {
			name: 'Supermarket Updated',
			month: '2026-02',
			amount: 350.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})

		const updated = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket Updated')
		expect(updated).not.toBeNull()
		if (!updated) throw new Error('Expense not found in test')
		expect(updated.amount).toBe(350.0)
	})

	it('should not update if name and date already exist in another variable expense in the same month', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const updateVariableExpense = new UpdateVariableExpenseUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})
		await createVariableExpense.execute({
			name: 'Cinema',
			month: '2026-02',
			amount: 50.0,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: '2026-02-10',
		})

		const expense = (await repository.findByMonth('2026-02')).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await expect(
			updateVariableExpense.execute(expense.id, {
				name: 'Cinema',
				month: '2026-02',
				amount: 60.0,
				category: ExpenseCategory.LEISURE,
				necessary: false,
				date: '2026-02-10',
			}),
		).rejects.toThrow()
	})
})
