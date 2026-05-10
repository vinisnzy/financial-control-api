import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateFixedExpenseInput } from '@/domain/repositories/fixed-expense/dtos/create-fixed-expense-input.dto.js'
import type { FixedExpenseRepository } from '@/domain/repositories/fixed-expense/fixed-expense-repository.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import { toPrismaExpenseCategory } from '../mapper/expense-category-mapper.js'
import { fixedExpensePrismaToEntity } from '../mapper/fixed-expense-prisma-to-entity.js'

export class PrismaFixedExpenseRepository implements FixedExpenseRepository {
	async findAll(pagination?: PaginationInput): Promise<PaginatedResult<FixedExpense>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [fixedExpenses, total] = await prisma.$transaction([
			prisma.fixedExpense.findMany({ skip, take: limit }),
			prisma.fixedExpense.count(),
		])

		return {
			data: fixedExpenses.map((e) => fixedExpensePrismaToEntity(e)),
			total,
			page,
			limit,
		}
	}
	async findById(id: string): Promise<FixedExpense | null> {
		const fixedExpense = await prisma.fixedExpense.findUnique({
			where: { id },
		})
		if (!fixedExpense) {
			return null
		}
		return fixedExpensePrismaToEntity(fixedExpense)
	}
	async findByNameAndMonth(name: string, month: string): Promise<FixedExpense | null> {
		const fixedExpense = await prisma.fixedExpense.findFirst({
			where: { name, month },
		})
		if (!fixedExpense) {
			return null
		}
		return fixedExpensePrismaToEntity(fixedExpense)
	}
	async findByMonth(month: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { month },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}
	async findByCategory(category: ExpenseCategory): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { category: toPrismaExpenseCategory(category) },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}
	async findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), month },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}
	async findAllNecessary(): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { necessary: true },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}
	async findNecessaryByMonth(month: string): Promise<FixedExpense[]> {
		const fixedExpenses = await prisma.fixedExpense.findMany({
			where: { necessary: true, month },
		})
		return fixedExpenses.map((e) => fixedExpensePrismaToEntity(e))
	}
	async save(expense: FixedExpense): Promise<void> {
		try {
			await prisma.fixedExpense.update({
				where: { id: expense.id },
				data: {
					month: expense.month,
					name: expense.name,
					amount: expense.amount,
					category: toPrismaExpenseCategory(expense.category),
					necessary: expense.necessary,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
			}
		}
	}
	async create(data: CreateFixedExpenseInput): Promise<void> {
		await prisma.fixedExpense.create({
			data: {
				...data,
				category: toPrismaExpenseCategory(data.category),
			},
		})
	}
	async delete(id: string): Promise<void> {
		try {
			await prisma.fixedExpense.delete({
				where: { id },
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new ResourceNotFoundError(`Expense not found with id: ${id}`)
			}
		}
	}
}
