import { randomUUID } from 'node:crypto'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { PaginatedResult, PaginationInput } from '../../pagination.js'
import type { CreateVariableExpenseInput } from '../dtos/create-variable-expense-input.dto.js'
import type { VariableExpenseRepository } from '../variable-expense-repository.js'

export class InMemoryVariableExpenseRepository implements VariableExpenseRepository {
	public expenses: VariableExpense[] = []

	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<VariableExpense>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const filtered = this.expenses.filter((e) => e.userId === userId)
		const start = (page - 1) * limit

		return {
			data: filtered.slice(start, start + limit),
			total: filtered.length,
			page,
			limit,
		}
	}

	async findById(id: string, userId: string): Promise<VariableExpense | null> {
		return this.expenses.find((e) => e.id === id && e.userId === userId) ?? null
	}

	async findByMonth(month: string, userId: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.month === month && e.userId === userId)
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<VariableExpense | null> {
		return this.expenses.find((e) => e.name === name && e.month === month && e.userId === userId) ?? null
	}

	async findByCategory(category: ExpenseCategory, userId: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.category === category && e.userId === userId)
	}

	async findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.category === category && e.month === month && e.userId === userId)
	}

	async findAllNecessary(userId: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.userId === userId)
	}

	async findNecessaryByMonth(month: string, userId: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.month === month && e.userId === userId)
	}

	async save(expense: VariableExpense, userId: string): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id && e.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}

	async create(data: CreateVariableExpenseInput, userId: string): Promise<void> {
		const variableExpense = new VariableExpense({
			id: randomUUID().toString(),
			...data,
			userId,
		})
		this.expenses.push(variableExpense)
	}

	async delete(id: string, userId: string): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === id && e.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${id}`)
		}
		this.expenses.splice(index, 1)
	}
}
