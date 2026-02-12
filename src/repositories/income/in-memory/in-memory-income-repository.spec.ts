import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { Income } from '@/entities/income/income.js'
import { InMemoryIncomeRepository } from './in-memory-income-repository.js'

describe('In memory income repository', () => {
	it('should be return an empty list when find all incomes and there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const incomes = await repository.findAll()

		expect(incomes).toHaveLength(0)
		expect(incomes).toEqual([])
	})

	it('should be list all incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const income1 = new Income({
			id: randomUUID().toString(),
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
		})
		const income2 = new Income({
			id: randomUUID().toString(),
			name: 'Previous Balance',
			month: '2026-02',
			amount: 500.0,
		})

		await repository.create(income1)
		await repository.create(income2)

		const incomes = await repository.findAll()

		expect(incomes).toHaveLength(2)
		expect(incomes).toEqual(expect.arrayContaining([income1, income2]))
	})

	it('should be find income by id', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()
		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create(
			new Income({
				id,
				name,
				month,
				amount,
			}),
		)

		const response = await repository.findById(id)

		expect(response).not.toBeNullable()

		if (!response) throw new Error('Income not found in test')

		expect(response.id).toEqual(id)
		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
	})

	it('should not be find income by id when there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()

		const response = await repository.findById(id)

		expect(response).toBeNull()
	})

	it('should not be find income by id when current incomes does not have the corresponding id', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create(
			new Income({
				id: randomUUID().toString(),
				name: 'Salary',
				month: '2026-02',
				amount: 2000.0,
			}),
		)

		const otherId = randomUUID().toString()

		const response = await repository.findById(otherId)

		expect(response).toBeNull()
	})


	it('should not be find income by name when there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const name = 'Salary'

		const response = await repository.findByName(name)

		expect(response).toBeNull()
	})

	it('should not be find income by name when current incomes does not have the corresponding name', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create(
			new Income({
				id: randomUUID().toString(),
				name: 'Salary',
				month: '2026-02',
				amount: 2000.0,
			}),
		)

		const otherName = 'Bônus'

		const response = await repository.findByName(otherName)

		expect(response).toBeNull()
	})

	it('should be find income by name', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()
		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create(
			new Income({
				id,
				name,
				month,
				amount,
			}),
		)

		const response = await repository.findByName(name)

		expect(response).not.toBeNullable()

		if (!response) throw new Error('Income not found in test')

		expect(response.id).toEqual(id)
		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
	})

	it('should be return an empty list when find incomes by month and there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const incomes = await repository.findByMonth('2026-02')

		expect(incomes).toHaveLength(0)
		expect(incomes).toEqual([])
	})

	it('should be list incomes by month', async () => {
		const repository = new InMemoryIncomeRepository()

		const income1 = new Income({
			id: randomUUID().toString(),
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
		})
		const income2 = new Income({
			id: randomUUID().toString(),
			name: 'Previous Balance',
			month: '2026-02',
			amount: 500.0,
		})
		const income3 = new Income({
			id: randomUUID().toString(),
			name: 'January Salary',
			month: '2026-01',
			amount: 2500.0,
		})

		await repository.create(income1)
		await repository.create(income2)
		await repository.create(income3)

		const incomes = await repository.findByMonth('2026-02')

		expect(incomes.every((i) => i.month === '2026-02')).toBe(true)
		expect(incomes).toHaveLength(2)
		expect(incomes).toEqual(expect.arrayContaining([income1, income2]))
	})

	it('should be update an existing income', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()

		await repository.create(
			new Income({
				id,
				name: 'Salary',
				month: '2026-02',
				amount: 2000.0,
			}),
		)

		const name = 'Bônus'
		const month = '2026-02'
		const amount = 200.0

		const income = new Income({
			id,
			name,
			month,
			amount,
		})

		await repository.save(income)
		const savedIncome = await repository.findById(id)

		if (!savedIncome) throw new Error('Income not found in test')
		expect(savedIncome.id).toEqual(id)
		expect(savedIncome.name).toEqual(name)
		expect(savedIncome.month).toEqual(month)
		expect(savedIncome.amount).toEqual(amount)
	})

	it('should not be a save an income when there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const income = new Income({
			id: randomUUID().toString(),
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
		})

		await expect(repository.save(income)).rejects.toThrow()
	})

	it('should be create an income', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()

		const income = new Income({
			id,
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
		})

		await repository.create(income)

		const incomes = await repository.findAll()

		expect(incomes).toHaveLength(1)
		expect(incomes[0].id).toEqual(id)
	})

	it('should be delete an income', async () => {
		const repository = new InMemoryIncomeRepository()

		const id = randomUUID().toString()

		const income = new Income({
			id,
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
		})

		await repository.create(income)

		await repository.delete(id)

		const incomes = await repository.findAll()

		expect(incomes).toHaveLength(0)
		expect(incomes).toEqual([])

		const deletedIncome = await repository.findById(id)
		expect(deletedIncome).toBeNull()
	})
})
