import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'

describe('Create variable expense use case', () => {
	it('should create a variable expense', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})

		expect(await repository.findAll()).toHaveLength(1)
		const all = await repository.findByMonth('2026-02')
		expect(all.some((e) => e.name === 'Supermarket' && e.date === '2026-02-10')).toBe(true)
	})

	it('should not create a variable expense with same name and date in the same month', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		const request = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		}
		await createVariableExpense.execute(request)
		await expect(createVariableExpense.execute(request)).rejects.toThrow()
	})

	it('should create variable expenses with same name in different months', async () => {
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-02-10',
		})
		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-03',
			amount: 350.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: '2026-03-10',
		})
		expect(await repository.findAll()).toHaveLength(2)
	})
})
