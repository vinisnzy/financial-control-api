import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'

import { Income } from '@/domain/entities/income/income.js'
import { PrismaIncomeRepository } from './prisma-income-repository.js'

const USER_ID = randomUUID()

describe('Prisma income repository', () => {
	it('should return an empty list when find all incomes and there are no incomes', async () => {
		const repository = new PrismaIncomeRepository()
		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(0)
		expect(result.data).toEqual([])
		expect(result.total).toBe(0)
	})

	it('should list all incomes', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)
		await repository.create({ name: 'Previous Balance', month: '2026-02', amount: 500.0, userId: USER_ID }, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
	})

	it('should paginate incomes correctly', async () => {
		const repository = new PrismaIncomeRepository()

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

	it('should find income by id', async () => {
		const repository = new PrismaIncomeRepository()

		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create({ name, month, amount, userId: USER_ID }, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const response = await repository.findById(id, USER_ID)

		expect(response).not.toBeNull()

		if (!response) throw new Error('Income not found in test')

		expect(response.id).toEqual(id)
		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
	})

	it('should not find income by id when there are no incomes', async () => {
		const repository = new PrismaIncomeRepository()

		const response = await repository.findById(randomUUID(), USER_ID)

		expect(response).toBeNull()
	})

	it('should not find income by id when current incomes does not have the corresponding id', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)

		const response = await repository.findById(randomUUID(), USER_ID)

		expect(response).toBeNull()
	})

	it('should not find income by name when there are no incomes', async () => {
		const repository = new PrismaIncomeRepository()

		const response = await repository.findByNameAndMonth('Salary', '2026-02', USER_ID)

		expect(response).toBeNull()
	})

	it('should not find income by name and month when current incomes does not have the corresponding name', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)

		const response = await repository.findByNameAndMonth('Bônus', '2026-02', USER_ID)

		expect(response).toBeNull()
	})

	it('should not find income by name and month when current incomes does not have the corresponding month', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)

		const response = await repository.findByNameAndMonth('Salary', '2026-03', USER_ID)

		expect(response).toBeNull()
	})

	it('should find income by name and month', async () => {
		const repository = new PrismaIncomeRepository()

		const name = 'Salary'
		const month = '2026-02'
		const amount = 2000.0

		await repository.create({ name, month, amount, userId: USER_ID }, USER_ID)

		const response = await repository.findByNameAndMonth(name, month, USER_ID)

		expect(response).not.toBeNull()

		if (!response) throw new Error('Income not found in test')

		expect(response.name).toEqual(name)
		expect(response.month).toEqual(month)
		expect(response.amount).toEqual(amount)
	})

	it('should return an empty list when find incomes by month and there are no incomes', async () => {
		const repository = new PrismaIncomeRepository()
		const incomes = await repository.findByMonth('2026-02', USER_ID)

		expect(incomes).toHaveLength(0)
		expect(incomes).toEqual([])
	})

	it('should list incomes by month', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)
		await repository.create({ name: 'Previous Balance', month: '2026-02', amount: 500.0, userId: USER_ID }, USER_ID)
		await repository.create({ name: 'January Salary', month: '2026-01', amount: 2500.0, userId: USER_ID }, USER_ID)

		const incomes = await repository.findByMonth('2026-02', USER_ID)

		expect(incomes.every((i) => i.month === '2026-02')).toBe(true)
		expect(incomes).toHaveLength(2)
	})

	it('should update an existing income', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Salary', month: '2026-02', amount: 2000.0, userId: USER_ID }, USER_ID)

		const result = await repository.findAll(USER_ID)
		const id = result.data[0].id

		const name = 'Bônus'
		const month = '2026-02'
		const amount = 200.0

		const income = new Income({ id, name, month, amount, userId: USER_ID })

		await repository.save(income, USER_ID)
		const savedIncome = await repository.findById(id, USER_ID)

		if (!savedIncome) throw new Error('Income not found in test')
		expect(savedIncome.id).toEqual(id)
		expect(savedIncome.name).toEqual(name)
		expect(savedIncome.month).toEqual(month)
		expect(savedIncome.amount).toEqual(amount)
	})

	it('should throw when trying to save an income that does not exist', async () => {
		const repository = new PrismaIncomeRepository()

		const income = new Income({
			id: randomUUID(),
			name: 'Bônus',
			month: '2026-02',
			amount: 200.0,
			userId: USER_ID,
		})

		await expect(repository.save(income, USER_ID)).rejects.toThrow()
	})

	it('should create an income', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Bônus', month: '2026-02', amount: 200.0, userId: USER_ID }, USER_ID)

		const result = await repository.findAll(USER_ID)

		expect(result.data).toHaveLength(1)
		expect(result.total).toBe(1)
	})

	it('should delete an income', async () => {
		const repository = new PrismaIncomeRepository()

		await repository.create({ name: 'Bônus', month: '2026-02', amount: 200.0, userId: USER_ID }, USER_ID)

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
		const repository = new PrismaIncomeRepository()
		await expect(repository.delete('non-existent-id', USER_ID)).rejects.toThrow('Income not found with id: non-existent-id')
	})
})
