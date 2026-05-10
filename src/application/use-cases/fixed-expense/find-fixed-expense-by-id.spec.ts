import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'
import { FindFixedExpenseByIdUseCase } from './find-fixed-expense-by-id.js'

describe('Find fixed expense by id use case', () => {
	it('should find fixed expense by id', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findById = new FindFixedExpenseByIdUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})
		const expense = await repository.findByNameAndMonth('Rent', '2026-02', userId)
		if (!expense) throw new Error('Expense not found in test')

		const found = await findById.execute(expense.id, userId)
		expect(found).not.toBeNull()
		if (!found) throw new Error('Expense not found in test')
		expect(found.name).toBe('Rent')
	})

	it('should throw error if fixed expense id does not exist', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const findById = new FindFixedExpenseByIdUseCase(repository)
		await expect(findById.execute(randomUUID(), userId)).rejects.toThrow()
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)
		const findById = new FindFixedExpenseByIdUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})
		const expense = await repository.findByNameAndMonth('Rent', '2026-02', userId)
		if (!expense) throw new Error('Expense not found in test')

		await expect(findById.execute(expense.id, otherUserId)).rejects.toThrow()
	})
})
