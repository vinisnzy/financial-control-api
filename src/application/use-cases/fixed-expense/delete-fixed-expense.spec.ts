import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { DeleteFixedExpenseUseCase } from './delete-fixed-expense.js'

describe('Delete fixed expense use case', () => {
	it('should delete an existing fixed expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const deleteFixedExpense = new DeleteFixedExpenseUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const expense = await repository.findByNameAndMonth('Rent', '2026-02')
		expect(expense).not.toBeNull()
		if (!expense) throw new Error('Expense not found in test')

		await deleteFixedExpense.execute(expense.id)

		expect(await repository.findByNameAndMonth('Rent', '2026-02')).toBeNull()
		expect(await repository.findAll()).toHaveLength(0)
	})

	it('should throw when deleting a non-existent fixed expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const deleteFixedExpense = new DeleteFixedExpenseUseCase(repository)

		await expect(deleteFixedExpense.execute('non-existent-id')).rejects.toThrow()
	})
})
