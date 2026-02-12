import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import type { FixedExpenseRepository } from '../fixed-expense-repository.js'

export class InMemoryFixedExpenseRepository implements FixedExpenseRepository {
	public expenses: FixedExpense[] = []

	async findAll(): Promise<FixedExpense[]> {
		return this.expenses
	}
	async findById(id: string): Promise<FixedExpense | null> {
		return this.expenses.find((e) => e.id === id) ?? null
	}
	async findByMonth(month: string): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.month === month)
	}
	async findByCategory(category: ExpenseCategory): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.category === category)
	}
	async findAllNecessary(): Promise<FixedExpense[]> {
		return this.expenses.filter((e) => e.necessary)
	}
	async save(expense: FixedExpense): Promise<void> {
		const index = this.expenses.findIndex((e) => e.id === expense.id)
		if (index === -1) {
			throw new Error(`Expense not found with id: ${expense.id}`)
		}

		this.expenses[index] = expense
	}
	async create(expense: FixedExpense): Promise<void> {
		this.expenses.push(expense)
	}
	async delete(id: string): Promise<void> {
		this.expenses = this.expenses.filter((e) => e.id !== id)
	}
}
