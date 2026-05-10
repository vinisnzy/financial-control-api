import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindIncomeByIdUseCase } from './find-income-by-id.js'

describe('Find income by id use case', () => {
	it('should find income by id', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findById = new FindIncomeByIdUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)

		if (!income) throw new Error('Income not found in test')

		const found = await findById.execute(income.id, userId)
		expect(found).not.toBeNull()

		if (!found) throw new Error('Income not found in test')

		expect(found.name).toBe('Salary')
	})

	it('should throw error if income id does not exist', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const findById = new FindIncomeByIdUseCase(repository)
		await expect(findById.execute(randomUUID(), userId)).rejects.toThrow()
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findById = new FindIncomeByIdUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)

		if (!income) throw new Error('Income not found in test')

		await expect(findById.execute(income.id, otherUserId)).rejects.toThrow()
	})
})
