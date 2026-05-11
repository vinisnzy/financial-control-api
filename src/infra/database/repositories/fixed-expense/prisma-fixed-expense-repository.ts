import { httpErrors } from '@fastify/sensible'
import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { CreateFixedExpenseInput } from '@/domain/repositories/fixed-expense/dtos/create-fixed-expense-input.dto.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import { toPrismaExpenseCategory } from '../../mapper/expense-category-mapper.js'
import { fixedExpensePrismaToEntity } from '../../mapper/fixed-expense-prisma-to-entity.js'

export class PrismaFixedExpenseRepository implements FixedExpenseRepository {
	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<FixedExpense>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [fixedExpenses, total] = await prisma.$transaction([
			prisma.fixedExpense.findMany({ where: { userId }, skip, take: limit }),
			prisma.fixedExpense.count({ where: { userId } }),
		])

		return {
			data: fixedExpenses.map((e) => fixedExpensePrismaToEntity(e)),
			total,
			page,
			limit,
		}
	}

	async findById(id: string, userId: string): Promise<FixedExpense | null> {
		const fixedExpense = await prisma.fixedExpense.findFirst({
			where: { id, userId },
		})
		if (!fixedExpense) {
			return null
		}
		return fixedExpensePrismaToEntity(fixedExpense)
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<FixedExpense | null> {
		const fixedExpense = await prisma.fixedExpense.findFirst({
			where: { name, month, userId },
		})
		if (!fixedExpense) {
			return null
		}
		return fixedExpensePrismaToEntity(fixedExpense)
	}

	async findByMonth(month: string, userId: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { month, userId },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}

	async findByCategory(category: ExpenseCategory, userId: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), userId },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}

	async findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), month, userId },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}

	async findAllNecessary(userId: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { necessary: true, userId },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}

	async findNecessaryByMonth(month: string, userId: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { necessary: true, month, userId },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}

	async save(expense: FixedExpense, userId: string): Promise<void> {
		try {
			await prisma.fixedExpense.update({
				where: { id: expense.id },
				data: {
					month: expense.month,
					name: expense.name,
					amount: expense.amount,
					category: toPrismaExpenseCategory(expense.category),
					necessary: expense.necessary,
					userId,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`Expense not found with id: ${expense.id}`)
			}
		}
	}

	async create(data: CreateFixedExpenseInput, userId: string): Promise<void> {
		await prisma.fixedExpense.create({
			data: {
				...data,
				category: toPrismaExpenseCategory(data.category),
				userId,
			},
		})
	}

	async delete(id: string, userId: string): Promise<void> {
		const result = await prisma.fixedExpense.deleteMany({ where: { id, userId } })
		if (result.count === 0) {
			throw httpErrors.notFound(`Expense not found with id: ${id}`)
		}
	}
}
