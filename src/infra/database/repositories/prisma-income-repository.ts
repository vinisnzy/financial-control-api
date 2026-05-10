import { httpErrors } from '@fastify/sensible'
import type { Income } from '@/domain/entities/income/income.js'
import type { CreateIncomeInput } from '@/domain/repositories/income/dtos/create-income-input.dto.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import { incomePrismaToEntity } from '../mapper/income-prisma-to-entity.js'

export class PrismaIncomeRepository implements IncomeRepository {
	async findAll(pagination?: PaginationInput): Promise<PaginatedResult<Income>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [incomes, total] = await prisma.$transaction([
			prisma.income.findMany({ skip, take: limit }),
			prisma.income.count(),
		])

		return {
			data: incomes.map((i) => incomePrismaToEntity(i)),
			total,
			page,
			limit,
		}
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
		try {
			await prisma.income.update({
				where: { id: income.id },
				data: {
					name: income.name,
					month: income.month,
					amount: income.amount,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`Income not found with id: ${income.id}`)
			}
		}
	}
	async create(data: CreateIncomeInput): Promise<void> {
		await prisma.income.create({ data })
	}
	async delete(id: string): Promise<void> {
		try {
			await prisma.income.delete({ where: { id } })
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`Income not found with id: ${id}`)
			}
		}
	}
}
