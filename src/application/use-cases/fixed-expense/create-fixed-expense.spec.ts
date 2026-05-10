import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { InMemoryFixedExpenseRepository } from '@/domain/repositories/fixed-expense/in-memory/in-memory-fixed-expense-repository.js'
import { CreateFixedExpenseUseCase } from './create-fixed-expense.js'

describe('Create fixed expense use case', () => {
	it('should create a fixed expense', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)

		await createFixedExpense.execute({
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		})

		expect((await repository.findAll(userId)).total).toBe(1)
		expect(await repository.findByNameAndMonth('Rent', '2026-02', userId)).not.toBeNull()
	})

	it('should not create a fixed expense when one with same name and month exists', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)

		const request = {
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		}
		await createFixedExpense.execute(request)

		await expect(createFixedExpense.execute(request)).rejects.toThrow()
	})

	it('should create a fixed expense with same name but different months', async () => {
		const userId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)

		const request = {
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
			userId,
		}
		await createFixedExpense.execute(request)

		await createFixedExpense.execute({ ...request, month: '2026-03' })

		expect((await repository.findAll(userId)).total).toBe(2)
		expect(await repository.findByNameAndMonth('Rent', '2026-03', userId)).not.toBeNull()
	})

	it('deve permitir criar despesa fixa com mesmo nome e mês para usuários diferentes', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryFixedExpenseRepository()
		const createFixedExpense = new CreateFixedExpenseUseCase(repository)

		const base = {
			name: 'Rent',
			month: '2026-02',
			amount: 1200.0,
			category: ExpenseCategory.SUBSCRIPTION,
			necessary: true,
		}
		await createFixedExpense.execute({ ...base, userId })
		await createFixedExpense.execute({ ...base, userId: otherUserId })

		expect((await repository.findAll(userId)).total).toBe(1)
		expect((await repository.findAll(otherUserId)).total).toBe(1)
	})
})
