import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindIncomesByMonthUseCase } from './find-income-by-month.js'

describe('Find incomes by month use case', () => {
	it('should find incomes by month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByMonth = new FindIncomesByMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		await createIncome.execute({ name: 'Bonus', month: '2026-02', amount: 500, userId })
		await createIncome.execute({ name: 'Gift', month: '2026-03', amount: 100, userId })

		const feb = await findByMonth.execute('2026-02', userId)
		expect(feb).toHaveLength(2)
		const mar = await findByMonth.execute('2026-03', userId)
		expect(mar).toHaveLength(1)
		const apr = await findByMonth.execute('2026-04', userId)
		expect(apr).toHaveLength(0)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByMonth = new FindIncomesByMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		await createIncome.execute({ name: 'Other Income', month: '2026-02', amount: 1000, userId: otherUserId })

		const result = await findByMonth.execute('2026-02', userId)
		expect(result).toHaveLength(1)
		expect(result[0].name).toBe('Salary')
	})
})
