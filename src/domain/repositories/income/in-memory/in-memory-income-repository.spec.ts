import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { Income } from '@/domain/entities/income/income.js'
import { InMemoryIncomeRepository } from './in-memory-income-repository.js'

const USER_ID = randomUUID()

describe('In memory income repository', () => {
	it('should be return an empty list when find all incomes and there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(0)
		expect(result.data).toEqual([])
		expect(result.total).toBe(0)
	})

	it('should be list all incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const income1 = {
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}
		const income2 = {
			name: 'Previous Balance',
			month: '2026-02',
			amount: 500.0,
			userId: USER_ID,
		}
		await repository.create(income1, USER_ID)
		await repository.create(income2, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
	})

	it('should paginate incomes correctly', async () => {
		const repository = new InMemoryIncomeRepository()

		for (let i = 1; i <= 5; i++) {
			await repository.create({ name: `Income ${i}`, month: '2026-02', amount: i * 100, userId: USER_ID }, USER_ID)
		}

		const page1 = await repository.findAll(USER_ID, { page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await repository.findAll(USER_ID, { page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await repository.findAll(USER_ID, { page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('should be find income by id', async () => {
		const repository = new InMemoryIncomeRepository()

		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create({
			name,
			month,
			amount,
			userId: USER_ID,
		}, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const response = await repository.findById(id, USER_ID)

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

		const response = await repository.findById(id, USER_ID)

		expect(response).toBeNull()
	})

	it('should not be find income by id when current incomes does not have the corresponding id', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}, USER_ID)

		const otherId = randomUUID().toString()

		const response = await repository.findById(otherId, USER_ID)

		expect(response).toBeNull()
	})

	it('should not be find income by name when there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()

		const name = 'Salary'
		const month = '2026-02'

		const response = await repository.findByNameAndMonth(name, month, USER_ID)

		expect(response).toBeNull()
	})

	it('should not be find income by name and month when current incomes does not have the corresponding name', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}, USER_ID)

		const otherName = 'Bônus'

		const response = await repository.findByNameAndMonth(otherName, '2026-02', USER_ID)

		expect(response).toBeNull()
	})

	it('should not be find income by name and month when current incomes does not have the corresponding month', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}, USER_ID)

		const otherMonth = '2026-03'

		const response = await repository.findByNameAndMonth('Salary', otherMonth, USER_ID)

		expect(response).toBeNull()
	})

	it('should be find income by name and month', async () => {
		const repository = new InMemoryIncomeRepository()

		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create({
			name,
			month,
			amount,
			userId: USER_ID,
		}, USER_ID)

		const response = await repository.findByNameAndMonth(name, month, USER_ID)

		expect(response).not.toBeNullable()

		if (!response) throw new Error('Income not found in test')

		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
	})

	it('should be return an empty list when find incomes by month and there are no incomes', async () => {
		const repository = new InMemoryIncomeRepository()
		const incomes = await repository.findByMonth('2026-02', USER_ID)

		expect(incomes).toHaveLength(0)
		expect(incomes).toEqual([])
	})

	it('should be list incomes by month', async () => {
		const repository = new InMemoryIncomeRepository()

		const income1 = {
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}
		const income2 = {
			name: 'Previous Balance',
			month: '2026-02',
			amount: 500.0,
			userId: USER_ID,
		}
		const income3 = {
			name: 'January Salary',
			month: '2026-01',
			amount: 2500.0,
			userId: USER_ID,
		}
		await repository.create(income1, USER_ID)
		await repository.create(income2, USER_ID)
		await repository.create(income3, USER_ID)

		const incomes = await repository.findByMonth('2026-02', USER_ID)

		expect(incomes.every((i) => i.month === '2026-02')).toBe(true)
		expect(incomes).toHaveLength(2)
	})

	it('should be update an existing income', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Salary',
			month: '2026-02',
			amount: 2000.0,
			userId: USER_ID,
		}, USER_ID)

		const name = 'Bônus'
		const month = '2026-02'
		const amount = 200.0

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const income = new Income({
			id,
			name,
			month,
			amount,
			userId: USER_ID,
		})

		await repository.save(income, USER_ID)
		const savedIncome = await repository.findById(id, USER_ID)

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
			userId: USER_ID,
		})

		await expect(repository.save(income, USER_ID)).rejects.toThrow()
	})

	it('should be create an income', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
			userId: USER_ID,
		}, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(1)
		expect(result.total).toBe(1)
	})

	it('should be delete an income', async () => {
		const repository = new InMemoryIncomeRepository()

		await repository.create({
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
			userId: USER_ID,
		}, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		await repository.delete(id, USER_ID)

		const resultAfterDelete = await repository.findAll(USER_ID)

		expect(resultAfterDelete.data).toHaveLength(0)
		expect(resultAfterDelete.data).toEqual([])
		expect(resultAfterDelete.total).toBe(0)

		const deletedIncome = await repository.findById(id, USER_ID)
		expect(deletedIncome).toBeNull()
	})

	it('should throw if trying to delete a non-existent income', async () => {
		const repository = new InMemoryIncomeRepository()
		await expect(repository.delete('non-existent-id', USER_ID)).rejects.toThrow('Income not found with id: non-existent-id')
	})
})
