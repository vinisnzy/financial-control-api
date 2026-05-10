import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { DeleteIncomeUseCase } from './delete-income.js'

describe('Delete income use case', () => {
	it('should delete an existing income', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const deleteIncome = new DeleteIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId,
		})

		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)
		expect(income).not.toBeNull()

		if (!income) throw new Error('Income not found in test')

		await deleteIncome.execute(income.id, userId)

		expect(await repository.findByNameAndMonth('Salary', '2026-02', userId)).toBeNull()
		expect((await repository.findAll(userId)).total).toBe(0)
	})

	it('should throw when deleting a non-existent income', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const deleteIncome = new DeleteIncomeUseCase(repository)

		await expect(deleteIncome.execute(randomUUID(), userId)).rejects.toThrow()
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const deleteIncome = new DeleteIncomeUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000.0, userId })

		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)
		if (!income) throw new Error('Income not found in test')

		await expect(deleteIncome.execute(income.id, otherUserId)).rejects.toThrow()
	})
})
