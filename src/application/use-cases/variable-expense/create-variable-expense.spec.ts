import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'

describe('Create variable expense use case', () => {
	it('should create a variable expense', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		const date = new Date(Date.UTC(2026, 1, 10))
		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date,
			userId,
		})

		expect((await repository.findAll(userId)).total).toBe(1)
		const all = await repository.findByMonth('2026-02', userId)
		expect(all.some((e) => e.name === 'Supermarket' && e.date === date)).toBe(true)
	})

	it('should create variable expenses with same name in different months', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-03',
			amount: 350.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 2, 10)),
			userId,
		})
		expect((await repository.findAll(userId)).total).toBe(2)
	})

	it('deve permitir criar despesa variável com mesmo nome e mês para usuários diferentes', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)

		const base = {
			name: 'Supermarket',
			month: '2026-02',
			amount: 300.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
		}
		await createVariableExpense.execute({ ...base, userId })
		await createVariableExpense.execute({ ...base, userId: otherUserId })

		expect((await repository.findAll(userId)).total).toBe(1)
		expect((await repository.findAll(otherUserId)).total).toBe(1)
	})
})
