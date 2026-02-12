import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
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
	async findAllNecessary(): Promise<VariableExpense[]> {
		return this.expenses.filter((e) => e.necessary)
	}
	async save(expense: VariableExpense): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id)
		if (index === -1) {
			throw new Error(`Income not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}
	async create(expense: VariableExpense): Promise<void> {
		this.expenses.push(expense)
	}
	async delete(id: string): Promise<void> {
		this.expenses = this.expenses.filter((e) => e.id !== id)
	}
}
