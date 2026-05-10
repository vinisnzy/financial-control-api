import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { FindVariableExpenseByIdUseCase } from './find-variable-expense-by-id.js'

describe('Find variable expense by id use case', () => {
	it('should find variable expense by id', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findById = new FindVariableExpenseByIdUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		const expense = (await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		const found = await findById.execute(expense.id, userId)
		expect(found).not.toBeNull()
		if (!found) throw new Error('Expense not found in test')
		expect(found.name).toBe('Supermarket')
	})

	it('should throw error if variable expense id does not exist', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const findById = new FindVariableExpenseByIdUseCase(repository)
		await expect(findById.execute(randomUUID(), userId)).rejects.toThrow()
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const findById = new FindVariableExpenseByIdUseCase(repository)

		await createVariableExpense.execute({
			name: 'Supermarket',
			month: '2026-02',
			amount: 300,
			category: ExpenseCategory.FOOD,
			necessary: true,
			date: new Date(Date.UTC(2026, 1, 10)),
			userId,
		})
		const expense = (await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket')
		if (!expense) throw new Error('Expense not found in test')

		await expect(findById.execute(expense.id, otherUserId)).rejects.toThrow()
	})
})
