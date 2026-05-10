import { httpErrors } from '@fastify/sensible'
import type { Income } from '@/domain/entities/income/income.js'
import type { CreateIncomeInput } from '@/domain/repositories/income/dtos/create-income-input.dto.js'
import type { IncomeRepository } from '@/domain/repositories/income/income-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import { incomePrismaToEntity } from '../mapper/income-prisma-to-entity.js'

export class PrismaIncomeRepository implements IncomeRepository {
	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<Income>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [incomes, total] = await prisma.$transaction([
			prisma.income.findMany({ where: { userId }, skip, take: limit }),
			prisma.income.count({ where: { userId } }),
		])

		return {
			data: incomes.map((i) => incomePrismaToEntity(i)),
			total,
			page,
			limit,
		}
	}

	async findById(id: string, userId: string): Promise<Income | null> {
		const income = await prisma.income.findFirst({
			where: { id, userId },
		})
		if (!income) {
			return null
		}
		return incomePrismaToEntity(income)
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<Income | null> {
		const income = await prisma.income.findFirst({
			where: { name, month, userId },
		})
		if (!income) {
			return null
		}
		return incomePrismaToEntity(income)
	}

	async findByMonth(month: string, userId: string): Promise<Income[]> {
		const incomes = await prisma.income.findMany({
			where: { month, userId },
		})
		return incomes.map((i) => incomePrismaToEntity(i))
	}

	async save(income: Income, userId: string): Promise<void> {
		try {
			await prisma.income.update({
				where: { id: income.id },
				data: {
					name: income.name,
					month: income.month,
					amount: income.amount,
					userId,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`Income not found with id: ${income.id}`)
			}
		}
	}

	async create(data: CreateIncomeInput, userId: string): Promise<void> {
		await prisma.income.create({ data: { ...data, userId } })
	}

	async delete(id: string, userId: string): Promise<void> {
		const result = await prisma.income.deleteMany({ where: { id, userId } })
		if (result.count === 0) {
			throw httpErrors.notFound(`Income not found with id: ${id}`)
		}
	}
}
