import { httpErrors } from '@fastify/sensible'
import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import type { CreateVariableExpenseInput } from '@/domain/repositories/variable-expense/dtos/create-variable-expense-input.dto.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import { toPrismaExpenseCategory } from '../../mapper/expense-category-mapper.js'
import { variableExpensePrismaToEntity } from '../../mapper/variable-expense-prisma-to-entity.js'

export class PrismaVariableExpenseRepository implements VariableExpenseRepository {
	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<VariableExpense>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [variableExpenses, total] = await prisma.$transaction([
			prisma.variableExpense.findMany({ where: { userId }, skip, take: limit }),
			prisma.variableExpense.count({ where: { userId } }),
		])

		return {
			data: variableExpenses.map((e) => variableExpensePrismaToEntity(e)),
			total,
			page,
			limit,
		}
	}

	async findById(id: string, userId: string): Promise<VariableExpense | null> {
		const variableExpense = await prisma.variableExpense.findFirst({
			where: { id, userId },
		})
		if (!variableExpense) {
			return null
		}
		return variableExpensePrismaToEntity(variableExpense)
	}

	async findByMonth(month: string, userId: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { month, userId },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<VariableExpense | null> {
		const variableExpense = await prisma.variableExpense.findFirst({
			where: { name, month, userId },
		})
		if (!variableExpense) return null
		return variableExpensePrismaToEntity(variableExpense)
	}

	async findByCategory(category: ExpenseCategory, userId: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), userId },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}

	async findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), month, userId },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}

	async findAllNecessary(userId: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { necessary: true, userId },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}

	async findNecessaryByMonth(month: string, userId: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { necessary: true, month, userId },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}

	async save(expense: VariableExpense, userId: string): Promise<void> {
		try {
			await prisma.variableExpense.update({
				where: { id: expense.id },
				data: {
					month: expense.month,
					name: expense.name,
					amount: expense.amount,
					category: toPrismaExpenseCategory(expense.category),
					necessary: expense.necessary,
					date: expense.date,
					userId,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`Expense not found with id: ${expense.id}`)
			}
		}
	}

	async create(data: CreateVariableExpenseInput, userId: string): Promise<VariableExpense> {
		const variableExpense = await prisma.variableExpense.create({
			data: {
				...data,
				category: toPrismaExpenseCategory(data.category),
				userId,
			},
		})
		return variableExpensePrismaToEntity(variableExpense)
	}

	async delete(id: string, userId: string): Promise<void> {
		const result = await prisma.variableExpense.deleteMany({ where: { id, userId } })
		if (result.count === 0) {
			throw httpErrors.notFound(`Expense not found with id: ${id}`)
		}
	}
}
