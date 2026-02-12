import { describe, expect, it } from 'vitest'
import { InMemoryIncomeRepository } from '@/repositories/income/in-memory/in-memory-income-repository.js'
import { CreateIncomeUseCase } from './create-income.js'
import { DeleteIncomeUseCase } from './delete-income.js'

describe('Delete income use case', () => {
	it('should delete an existing income', async () => {
		const repository = new InMemoryIncomeRepository()
		const createIncome = new CreateIncomeUseCase(repository)
		const deleteIncome = new DeleteIncomeUseCase(repository)

		await createIncome.execute({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
		})

		const income = await repository.findByNameAndMonth('Salary', '2026-02')
		expect(income).not.toBeNull()

		if (!income) throw new Error('Income not found in test')

		await deleteIncome.execute(income.id)

		expect(await repository.findByNameAndMonth('Salary', '2026-02')).toBeNull()
		expect(await repository.findAll()).toHaveLength(0)
	})

	it('should not throw when deleting a non-existent income', async () => {
		const repository = new InMemoryIncomeRepository()
		const deleteIncome = new DeleteIncomeUseCase(repository)

		await expect(deleteIncome.execute('non-existent-id')).resolves.toBeUndefined()
	})
})
