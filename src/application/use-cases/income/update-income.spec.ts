import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/domain/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { UpdateIncomeUseCase } from './update-income.js'

describe('Update income use case', () => {
	it('should update an existing income', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const updateIncome = new UpdateIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId,
		})

		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)

		if (!income) throw new Error('Income not found in test')

		await updateIncome.execute(income.id, userId, {
			name: 'Salary Updated',
			month: '2026-02',
			amount: 2500.0,
		})

		const updated = await repository.findByNameAndMonth('Salary Updated', '2026-02', userId)
		expect(updated).not.toBeNull()

		if (!updated) throw new Error('Income not found in test')

		expect(updated.amount).toBe(2500.0)
	})

	it('should not update if name and month already exist in another income', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const updateIncome = new UpdateIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId,
		})
		await createIncome.execute({
			name: 'Bonus',
			month: '2026-02',
			amount: 500.0,
			userId,
		})

		const bonus = await repository.findByNameAndMonth('Bonus', '2026-02', userId)

		if (!bonus) throw new Error('Income not found in test')

		await expect(
			updateIncome.execute(bonus.id, userId, {
				name: 'Salary',
				month: '2026-02',
				amount: 600.0,
			}),
		).rejects.toThrow()
	})

	it('should update income if name or month is unique', async () => {
		const userId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const updateIncome = new UpdateIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId,
		})

		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)

		if (!income) throw new Error('Income not found in test')

		await updateIncome.execute(income.id, userId, {
			name: 'Salary',
			month: '2026-03',
			amount: 2100.0,
		})

		const updated = await repository.findByNameAndMonth('Salary', '2026-03', userId)
		expect(updated).not.toBeNull()

		if (!updated) throw new Error('Income not found in test')

		expect(updated.amount).toBe(2100.0)
	})

	it('retorna não encontrado quando o registro pertence a outro usuário', async () => {
		const userId = randomUUID()
		const otherUserId = randomUUID()
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const updateIncome = new UpdateIncomeUseCase(repository)

		await createIncome.execute({ name: 'Salary', month: '2026-02', amount: 2000.0, userId })

		const income = await repository.findByNameAndMonth('Salary', '2026-02', userId)
		if (!income) throw new Error('Income not found in test')

		await expect(
			updateIncome.execute(income.id, otherUserId, {
				name: 'Salary Updated',
				month: '2026-02',
				amount: 2500.0,
			}),
		).rejects.toThrow()
	})
})
