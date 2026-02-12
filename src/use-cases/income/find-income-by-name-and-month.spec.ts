import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { findIncomeByNameAndMonthUseCase } from './find-income-by-name-and-month.js'

describe('Find income by name and month use case', () => {
	it('should find income by name and month', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByNameAndMonth = new findIncomeByNameAndMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000 })
		const found = await findByNameAndMonth.execute('Salary', '2026-02')
		expect(found).not.toBeNull()

        if (!found) throw new Error('Income not found in test')

		expect(found.amount).toBe(2000)
	})

	it('should return null if income with name and month does not exist', async () => {
		const repository = new InMemoryIncomeRepository()
		const findByNameAndMonth = new findIncomeByNameAndMonthUseCase(repository)
		const found = await findByNameAndMonth.execute('NonExistent', '2026-02')
		expect(found).toBeNull()
	})
})
