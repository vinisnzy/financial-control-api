import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindAllVariableExpensesUseCase } from './find-all-variable-expenses.js'

describe('Find all variable expenses use case', () => {
	it('should find all variable expenses', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAll = new FindAllVariableExpensesUseCase(repository)

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

		const result = await findAll.execute(userId)
		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
		const names = result.data.map((e) => e.name)
		expect(names).toContain('Supermarket')
		expect(names).toContain('Cinema')
	})

	it('should paginate variable expenses', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAll = new FindAllVariableExpensesUseCase(repository)

		for (let i = 1; i <= 5; i++) {
			await createVariableExpense.execute({
				name: `Expense ${i}`,
				month: '2026-02',
				amount: i * 100,
				category: ExpenseCategory.FOOD,
				necessary: true,
				date: new Date(Date.UTC(2026, 1, i)),
				userId,
			})
		}

		const page1 = await findAll.execute(userId, { page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await findAll.execute(userId, { page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await findAll.execute(userId, { page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findAll = new FindAllVariableExpensesUseCase(repository)

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
			month: '2026-02',
			amount: 50,
			category: ExpenseCategory.LEISURE,
			necessary: false,
			date: new Date(Date.UTC(2026, 1, 11)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Other Expense',
			month: '2026-02',
			amount: 100,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 12)),
			userId: otherUserId,
		})

		const result = await findAll.execute(userId)
		expect(result.total).toBe(2)
		const names = result.data.map((e) => e.name)
		expect(names).toContain('Supermarket')
		expect(names).toContain('Cinema')
		expect(names).not.toContain('Other Expense')
	})
})
