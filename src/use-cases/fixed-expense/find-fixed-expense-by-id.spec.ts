import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpenseByIdUseCase } from './find-fixed-expense-by-id.js'

describe('Find fixed expense by id use case', () => {
	it('should find fixed expense by id', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findById = new FindFixedExpenseByIdUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		const expense = await repository.findByNameAndMonth('Rent', '2026-02')
		if (!expense) throw new Error('Expense not found in test')

		const found = await findById.execute(expense.id)
		expect(found).not.toBeNull()
		if (!found) throw new Error('Expense not found in test')
		expect(found.name).toBe('Rent')
	})

	it('should return null if fixed expense id does not exist', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const findById = new FindFixedExpenseByIdUseCase(repository)
		const found = await findById.execute('non-existent-id')
		expect(found).toBeNull()
	})
})
