import { randomUUID } from 'node:crypto'
import { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateFixedExpenseInput } from '../dtos/create-fixed-expense-input.dto.js'
import type { FixedExpenseRepository } from '../fixed-expense-repository.js'

export class InMemoryFixedExpenseRepository implements FixedExpenseRepository {
	public expenses: FixedExpense[] = []

	async findAll(): Promise<FixedExpense[]> {
		return this.expenses
	}
	async findById(id: string): Promise<FixedExpense | null> {
		return this.expenses.find((e) => e.id === id) ?? null
	}

	async findByNameAndMonth(name: string, month: string): Promise<FixedExpense | null> {
		return this.expenses.find((e) => e.name === name && e.month === month) ?? null
	}

	async findByMonth(month: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.month === month)
	}
	async findByCategory(category: ExpenseCategory): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.category === category)
	}
	async findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.month === month && e.category === category)
	}
	async findAllNecessary(): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.necessary)
	}
	async findNecessaryByMonth(month: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.month === month)
	}
	async save(expense: FixedExpense): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}
	async create(data: CreateFixedExpenseInput): Promise<void> {
		const fixedExpense = new FixedExpense({
			id: randomUUID().toString(),
			...data,
		})
		this.expenses.push(fixedExpense)
	}
	async delete(id: string): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === id)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${id}`)
		}
		this.expenses.splice(index, 1)
	}
}
