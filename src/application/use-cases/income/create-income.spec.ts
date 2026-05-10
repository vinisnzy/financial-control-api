import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'

describe('Create income use case', () => {
	const userId = randomUUID()

	it('should be create an income', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId,
		})

		expect((await repository.findAll(userId)).total).toBe(1)
		expect(await repository.findByNameAndMonth('Salary', '2026-02', userId)).not.toBeNull()
	})

	it('should not be able a create an income when already exists an income with same name and same month', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)

		const request = { name: 'Salary', month: '2026-02', amount: 2000.0, userId }
		await createIncome.execute(request)

		await expect(createIncome.execute(request)).rejects.toThrow()
	})

	it('should be a create an income when already exists an income with same name but different months', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)

		const request = { name: 'Salary', month: '2026-02', amount: 2000.0, userId }
		await createIncome.execute(request)

		await createIncome.execute({ ...request, month: '2026-03' })

		expect((await repository.findAll(userId)).total).toBe(2)
		expect(await repository.findByNameAndMonth('Salary', '2026-03', userId)).not.toBeNull()
	})

	it('should be a create an income when already exists an income with same month but different names', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)

		const request = { name: 'Salary', month: '2026-02', amount: 2000.0, userId }
		await createIncome.execute(request)

		await createIncome.execute({ ...request, name: 'Bônus' })

		expect((await repository.findAll(userId)).total).toBe(2)
		expect(await repository.findByNameAndMonth('Bônus', '2026-02', userId)).not.toBeNull()
	})

	it('deve permitir criar renda com mesmo nome e mês para usuários diferentes', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const otherUserId = randomUUID()

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000.0, userId })
		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 3000.0, userId: otherUserId })

		expect((await repository.findAll(userId)).total).toBe(1)
		expect((await repository.findAll(otherUserId)).total).toBe(1)
	})
})
