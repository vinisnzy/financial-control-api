import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindAllIncomesUseCase } from './find-all-incomes.js'

describe('Find all incomes use case', () => {
	it('should find all incomes', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findAll = new FindAllIncomesUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		await createIncome.execute({ name: 'Bonus', month: '2026-03', amount: 500, userId })

		const result = await findAll.execute(userId)
		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
		const names = result.data.map((i) => i.name)
		expect(names).toContain('Salary')
		expect(names).toContain('Bonus')
	})

	it('should paginate incomes', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findAll = new FindAllIncomesUseCase(repository)

		for (let i = 1; i <= 5; i++) {
			await createIncome.execute({ name: `Income ${i}`, month: '2026-02', amount: i * 100, userId })
		}

		const page1 = await findAll.execute(userId, { page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await findAll.execute(userId, { page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await findAll.execute(userId, { page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('lista apenas os registros do usuário autenticado', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findAll = new FindAllIncomesUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		await createIncome.execute({ name: 'Bonus', month: '2026-02', amount: 500, userId })
		await createIncome.execute({ name: 'Other Income', month: '2026-02', amount: 1000, userId: otherUserId })

		const result = await findAll.execute(userId)
		expect(result.total).toBe(2)
		const names = result.data.map((i) => i.name)
		expect(names).toContain('Salary')
		expect(names).toContain('Bonus')
		expect(names).not.toContain('Other Income')
	})
})
