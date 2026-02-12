import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindIncomesByMonthUseCase } from './find-income-by-month.js'

describe('Find incomes by month use case', () => {
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
