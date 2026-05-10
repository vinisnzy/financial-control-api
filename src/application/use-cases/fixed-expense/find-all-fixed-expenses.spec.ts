import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindAllFixedExpensesUseCase } from './find-all-fixed-expenses.js'

describe('Find all fixed expenses use case', () => {
	it('should find all fixed expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findAll = new FindAllFixedExpensesUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})
		await createFixedExpense.execute({
			name: 'Internet',
			month: '2026-03',
			amount: 100,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		})

		const result = await findAll.execute({})
		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
		const names = result.data.map((e) => e.name)
		expect(names).toContain('Rent')
		expect(names).toContain('Internet')
	})

	it('should paginate fixed expenses', async () => {
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findAll = new FindAllFixedExpensesUseCase(repository)

		for (let i = 1; i <= 5; i++) {
			await createFixedExpense.execute({
				name: `Expense ${i}`,
				month: '2026-02',
				amount: i * 100,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
			})
		}

		const page1 = await findAll.execute({ page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await findAll.execute({ page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await findAll.execute({ page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})
})
