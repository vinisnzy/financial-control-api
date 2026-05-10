import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryVariableExpenseRepository } from '@/domain/repositories/variable-expense/in-memory/in-memory-variable-expense-repository.js'
import { CreateVariableExpenseUseCase } from './create-variable-expense.js'
import { DeleteVariableExpenseUseCase } from './delete-variable-expense.js'

describe('Delete variable expense use case', () => {
	it('should delete an existing variable expense', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const deleteVariableExpense = new DeleteVariableExpenseUseCase(repository)

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
		expect(expense).not.toBeNull()
		if (!expense) throw new Error('Expense not found in test')

		await deleteVariableExpense.execute(expense.id, userId)

		expect((await repository.findByMonth('2026-02', userId)).find((e) => e.name === 'Supermarket')).toBeUndefined()
		expect((await repository.findAll(userId)).total).toBe(0)
	})

	it('should not throw when deleting a non-existent variable expense', async () => {
		const userId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const deleteVariableExpense = new DeleteVariableExpenseUseCase(repository)

		const nonExistentId = randomUUID()
		await expect(deleteVariableExpense.execute(nonExistentId, userId)).rejects.toThrow(
			`Expense not found with id: ${nonExistentId}`,
		)
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryVariableExpenseRepository()
		const createVariableExpense = new CreateVariableExpenseUseCase(repository)
		const deleteVariableExpense = new DeleteVariableExpenseUseCase(repository)

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

		await expect(deleteVariableExpense.execute(expense.id, otherUserId)).rejects.toThrow()
	})
})
