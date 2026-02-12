import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindAllIncomesUseCase } from './find-all-incomes.js'
import { FindIncomesByMonthUseCase } from './find-income-by-month.js'
import { findIncomeByIdUseCase } from './find-income-by-id.js'
import { findIncomeByNameAndMonthUseCase } from './find-income-by-name-and-month.js'

describe('Find income use cases', () => {
	it('should find all incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findAll = new FindAllIncomesUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000 })
		await createIncome.execute({ name: 'Bonus', month: '2026-03', amount: 500 })

		const all = await findAll.execute()
		expect(all).toHaveLength(2)
		const names = all.map((i) => i.name)
		expect(names).toContain('Salary')
		expect(names).toContain('Bonus')
	})

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

	it('should find incomes by month', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByMonth = new FindIncomesByMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000 })
		await createIncome.execute({ name: 'Bonus', month: '2026-02', amount: 500 })
		await createIncome.execute({ name: 'Gift', month: '2026-03', amount: 100 })

		const feb = await findByMonth.execute('2026-02')
		expect(feb).toHaveLength(2)
		const mar = await findByMonth.execute('2026-03')
		expect(mar).toHaveLength(1)
		const apr = await findByMonth.execute('2026-04')
		expect(apr).toHaveLength(0)
	})
})
