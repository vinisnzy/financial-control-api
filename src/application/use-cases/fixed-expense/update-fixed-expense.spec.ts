import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { UpdateFixedExpenseUseCase } from './update-fixed-expense.js'

describe('Update fixed expense use case', () => {
	it('should update an existing fixed expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const updateFixedExpense = new UpdateFixedExpenseUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const expense = await repository.findByNameAndMonth('Rent', '2026-02')
		if (!expense) throw new Error('Expense not found in test')

		await updateFixedExpense.execute(expense.id, {
			name: 'Rent Updated',
			month: '2026-02',
			amount: 1300.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const updated = await repository.findByNameAndMonth('Rent Updated', '2026-02')
		expect(updated).not.toBeNull()
		if (!updated) throw new Error('Expense not found in test')
		expect(updated.amount).toBe(1300.0)
	})

	it('should not update if name and month already exist in another fixed expense', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const updateFixedExpense = new UpdateFixedExpenseUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Internet',
			month: '2026-02',
			amount: 100.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const rent = await repository.findByNameAndMonth('Rent', '2026-02')
		const internet = await repository.findByNameAndMonth('Internet', '2026-02')
		if (!rent || !internet) throw new Error('Expense not found in test')

		await expect(
			updateFixedExpense.execute(rent.id, {
				name: 'Internet',
				month: '2026-02',
				amount: 1200.0,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			}),
		).rejects.toThrow()
	})
})
