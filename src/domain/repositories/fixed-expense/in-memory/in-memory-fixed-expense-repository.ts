import { randomUUID } from 'node:crypto'
import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { PaginatedResult, PaginationInput } from '../../pagination.js'
import type { CreateFixedExpenseInput } from '../dtos/create-fixed-expense-input.dto.js'
import type { FixedExpenseRepository } from '../fixed-expense-repository.js'

export class InMemoryFixedExpenseRepository implements FixedExpenseRepository {
	public expenses: FixedExpense[] = []

	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<FixedExpense>> {
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

	async findById(id: string, userId: string): Promise<FixedExpense | null> {
		return this.expenses.find((e) => e.id === id && e.userId === userId) ?? null
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<FixedExpense | null> {
		return this.expenses.find((e) => e.name === name && e.month === month && e.userId === userId) ?? null
	}

	async findByMonth(month: string, userId: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.month === month && e.userId === userId)
	}

	async findByCategory(category: ExpenseCategory, userId: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.category === category && e.userId === userId)
	}

	async findByCategoryAndMonth(category: ExpenseCategory, month: string, userId: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.month === month && e.category === category && e.userId === userId)
	}

	async findAllNecessary(userId: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.userId === userId)
	}

	async findNecessaryByMonth(month: string, userId: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.month === month && e.userId === userId)
	}

	async save(expense: FixedExpense, userId: string): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id && e.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}

	async create(data: CreateFixedExpenseInput, userId: string): Promise<void> {
		const fixedExpense = new FixedExpense({
			id: randomUUID().toString(),
			...data,
			userId,
		})
		this.expenses.push(fixedExpense)
	}

	async delete(id: string, userId: string): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === id && e.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${id}`)
		}
		this.expenses.splice(index, 1)
	}
}
