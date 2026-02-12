import type { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '../income-repository.js'

export class InMemoryIncomeRepository implements IncomeRepository {
	public incomes: Income[] = []

	async findAll(): Promise<Income[]> {
		return this.incomes
	}

	async findById(id: string): Promise<Income | null> {
		return this.incomes.find((i) => i.id === id) ?? null
	}

	async findByNameAndMonth(name: string, month: string): Promise<Income | null> {
		return this.incomes.find((i) => i.name === name && i.month === month) ?? null
	}

	async findByMonth(month: string): Promise<Income[]> {
		return this.incomes.filter((i) => i.month === month)
	}

	async save(income: Income): Promise<void> {
		const index = this.incomes.findIndex((i) => i.id === income.id)
		if (index === -1) {
			throw new Error(`Income not found with id: ${income.id}`)
		}

		this.incomes[index] = income
	}

	async create(income: Income): Promise<void> {
		this.incomes.push(income)
	}

	async delete(id: string): Promise<void> {
		this.incomes = this.incomes.filter((i) => i.id !== id)
	}
}
2
