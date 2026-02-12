import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { findIncomeByIdUseCase } from './find-income-by-id.js'

describe('Find income by id use case', () => {
	it('should find income by id', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findById = new findIncomeByIdUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000 })
		const income = await repository.findByNameAndMonth('Salary', '2026-02')

        if (!income) throw new Error('Income not found in test')

		const found = await findById.execute(income.id)
		expect(found).not.toBeNull()

        if (!found) throw new Error('Income not found in test')

		expect(found.name).toBe('Salary')
	})

	it('should return null if income id does not exist', async () => {
		const repository = new InMemoryIncomeRepository()
		const findById = new findIncomeByIdUseCase(repository)
		const found = await findById.execute('non-existent-id')
		expect(found).toBeNull()
	})
})
