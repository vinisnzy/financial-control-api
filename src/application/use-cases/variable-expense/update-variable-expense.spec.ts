import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { UpdateVariableExpenseUseCase } from './update-variable-expense.js'

describe('Update variable expense use case', () => {
	it('should update an existing variable expense', async () => {
		const userId = randomUUID()
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
			userId,
		})

		const expense = (await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await updateVariableExpense.execute(expense.id, userId, {
			name: 'Supermarket Updated',
			month: '2026-02',
			amount: 350.0,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
		})

		const updated = (await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket Updated')
		expect(updated).not.toBeNull()
		if (!updated) throw new Error('Expense not found in test')
		expect(updated.amount).toBe(350.0)
	})

	it('should throw BadRequestError if another variable expense with same name and month already exists', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const updateVariableExpense = new UpdateVariableExpenseUseCase(repository)

		await repository.create(
			{
				name: 'Netflix',
				month: '2026-01',
				amount: 50,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: true,
				userId,
			},
			userId,
		)

		await repository.create(
			{
				name: 'Spotify',
				month: '2026-01',
				amount: 30,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: false,
				userId,
			},
			userId,
		)

		const existing = await repository.findByNameAndMonth('Spotify', '2026-01', userId)

		if (!existing) throw new Error('Expense not found in test')

		await expect(
			updateVariableExpense.execute(existing.id, userId, {
				name: 'Netflix',
				month: '2026-01',
				amount: 30,
				category: ExpenseCategory.SUBSCRIPTION,
				necessary: false,
			}),
		).rejects.toThrow('Already exists a variable expense with name: Netflix and month: 2026-01')
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
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
			userId,
		})

		const expense = (await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await expect(
			updateVariableExpense.execute(expense.id, otherUserId, {
				name: 'Supermarket Updated',
				month: '2026-02',
				amount: 350.0,
				category: ExpenseCategory.FOOD,
				necessary: true,
				date: new Date(Date.UTC(2026, 1, 10)),
			}),
		).rejects.toThrow()
	})
})
