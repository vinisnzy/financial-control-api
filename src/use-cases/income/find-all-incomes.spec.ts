import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindAllIncomesUseCase } from './find-all-incomes.js'

describe('Find all incomes use case', () => {
	it('should find all incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findAll = new FindAllIncomesUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000 })
		await createIncome.execute({ name: 'Bonus', month: '2026-03', amount: 500 })

		const all = await findAll.execute()
		expect(all).toHaveLength(2)
		const names = all.map(i => i.name)
		expect(names).toContain('Salary')
		expect(names).toContain('Bonus')
	})
})
