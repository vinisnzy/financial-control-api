import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateVariableExpenseInput } from '@/domain/repositories/variable-expense/dtos/create-variable-expense-input.dto.js'
import type { VariableExpenseRepository } from '@/domain/repositories/variable-expense/variable-expense-repository.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'
import { toPrismaExpenseCategory } from '../mapper/expense-category-mapper.js'
import { variableExpensePrismaToEntity } from '../mapper/variable-expense-prisma-to-entity.js'

export class PrismaVariableExpenseRepository implements VariableExpenseRepository {
	async findAll(): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany()
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async findById(id: string): Promise<VariableExpense | null> {
		const variableExpense = await prisma.variableExpense.findUnique({
			where: { id },
		})
		if (!variableExpense) {
			return null
		}
		return variableExpensePrismaToEntity(variableExpense)
	}
	async findByMonth(month: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { month },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async findByNameAndMonth(name: string, month: string): Promise<VariableExpense | null> {
		const variableExpense = await prisma.variableExpense.findFirst({
			where: { name, month },
		})
		if (!variableExpense) return null
		return variableExpensePrismaToEntity(variableExpense)
	}
	async findByCategory(category: ExpenseCategory): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { category: toPrismaExpenseCategory(category) },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { category: toPrismaExpenseCategory(category), month },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async findAllNecessary(): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { necessary: true },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async findNecessaryByMonth(month: string): Promise<VariableExpense[]> {
		const variableExpenses = await prisma.variableExpense.findMany({
			where: { necessary: true, month },
		})
		return variableExpenses.map((e) => variableExpensePrismaToEntity(e))
	}
	async save(expense: VariableExpense): Promise<void> {
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
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
			}
		}
	}
	async create(data: CreateVariableExpenseInput): Promise<void> {
		await prisma.variableExpense.create({
			data: {
				...data,
				category: toPrismaExpenseCategory(data.category),
			},
		})
	}
	async delete(id: string): Promise<void> {
		try {
			await prisma.variableExpense.delete({
				where: { id },
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new ResourceNotFoundError(`Expense not found with id: ${id}`)
			}
		}
	}
}
