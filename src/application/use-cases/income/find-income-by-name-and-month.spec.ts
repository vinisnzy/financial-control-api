import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { FindIncomeByNameAndMonthUseCase } from './find-income-by-name-and-month.js'

describe('Find income by name and month use case', () => {
	it('should find income by name and month', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByNameAndMonth = new FindIncomeByNameAndMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })
		const found = await findByNameAndMonth.execute('Salary', '2026-02', userId)
		expect(found).not.toBeNull()

		if (!found) throw new Error('Income not found in test')

		expect(found.amount).toBe(2000)
	})

	it('should throw error if income with name and month does not exist', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const findByNameAndMonth = new FindIncomeByNameAndMonthUseCase(repository)
		await expect(findByNameAndMonth.execute('NonExistent', '2026-02', userId)).rejects.toThrow()
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const findByNameAndMonth = new FindIncomeByNameAndMonthUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000, userId })

		await expect(findByNameAndMonth.execute('Salary', '2026-02', otherUserId)).rejects.toThrow()
	})
})
