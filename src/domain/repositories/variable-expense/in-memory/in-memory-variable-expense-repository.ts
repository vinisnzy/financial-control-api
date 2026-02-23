import { randomUUID } from 'node:crypto'
import { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/domain/enums/expense-category.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateVariableExpenseInput } from '../dtos/create-variable-expense-input.dto.js'
import type { VariableExpenseRepository } from '../variable-expense.js'

export class InMemoryVariableExpenseRepository implements VariableExpenseRepository {
	public expenses: VariableExpense[] = []

	async findAll(): Promise<VariableExpense[]> {
		return this.expenses
	}
	async findById(id: string): Promise<VariableExpense | null> {
		return this.expenses.find((e) => e.id === id) ?? null
	}
	async findByMonth(month: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.month === month)
	}
	async findByCategory(category: ExpenseCategory): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.category === category)
	}
	async findByCategoryAndMonth(category: ExpenseCategory, month: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.category === category && e.month === month)
	}
	async findAllNecessary(): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.necessary)
	}
	async findNecessaryByMonth(month: string): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.necessary && e.month === month)
	}
	async save(expense: VariableExpense): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id)
		if (index === -1) {
			throw new ResourceNotFoundError(`Expense not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}
	async create(data: CreateVariableExpenseInput): Promise<void> {
		const variableExpense = new VariableExpense({
			id: randomUUID().toString(),
			...data,
		})
		this.expenses.push(variableExpense)
	}
	async delete(id: string): Promise<void> {
		this.expenses = this.expenses.filter((e) => e.id !== id)
	}
}
