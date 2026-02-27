import type { Income } from '@/domain/entities/income/income.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateIncomeInput } from '@/domain/repositories/income/dtos/create-income-input.dto.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'
import { prisma } from '../lib/prisma.js'
import { incomePrismaToEntity } from '../mapper/income-prisma-to-entity.js'

export class IncomeRepositoryPostgres implements IncomeRepository {
	async findAll(): Promise<Income[]> {
		const incomes = await prisma.income.findMany()
		return incomes.map((i) => incomePrismaToEntity(i))
	}
	async findById(id: string): Promise<Income | null> {
		const income = await prisma.income.findUnique({
			where: { id },
		})
		if (!income) {
			return null
		}
		return incomePrismaToEntity(income)
	}
	async findByNameAndMonth(name: string, month: string): Promise<Income | null> {
		const income = await prisma.income.findFirst({
			where: { name, month },
		})
		if (!income) {
			return null
		}
		return incomePrismaToEntity(income)
	}
	async findByMonth(month: string): Promise<Income[]> {
		const incomes = await prisma.income.findMany({
			where: { month },
		})
		return incomes.map((i) => incomePrismaToEntity(i))
	}
	async save(income: Income): Promise<void> {
		const existsIncome = await prisma.income.findUnique({
			where: { id: income.id },
		})
		if (!existsIncome) {
			throw new ResourceNotFoundError(`Income not found with id: ${income.id}`)
		}
		await prisma.income.update({
			where: { id: income.id },
			data: {
				name: income.name,
				month: income.month,
				amount: income.amount,
			},
		})
	}
	async create(data: CreateIncomeInput): Promise<void> {
		await prisma.income.create({ data })
	}
	async delete(id: string): Promise<void> {
		const existsIncome = await prisma.income.findUnique({
			where: { id },
		})
		if (!existsIncome) {
			throw new ResourceNotFoundError(`Income not found with id: ${id}`)
		}
		await prisma.income.delete({ where: { id } })
	}
}
