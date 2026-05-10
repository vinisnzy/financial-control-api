import { randomUUID } from 'node:crypto'
import { Income } from '@/domain/entities/income/income.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { PaginatedResult, PaginationInput } from '../../pagination.js'
import type { CreateIncomeInput } from '../dtos/create-income-input.dto.js'
import type { IncomeRepository } from '../income-repository.js'

export class InMemoryIncomeRepository implements IncomeRepository {
	public incomes: Income[] = []

	async findAll(pagination?: PaginationInput): Promise<PaginatedResult<Income>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const start = (page - 1) * limit

		return {
			data: this.incomes.slice(start, start + limit),
			total: this.incomes.length,
			page,
			limit,
		}
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
			throw new ResourceNotFoundError(`Income not found with id: ${income.id}`)
		}

		this.incomes[index] = income
	}

	async create(data: CreateIncomeInput): Promise<void> {
		const income = new Income({
			id: randomUUID().toString(),
			...data,
		})
		this.incomes.push(income)
	}

	async delete(id: string): Promise<void> {
		const index = this.incomes.findIndex((i) => i.id === id)
		if (index === -1) {
			throw new ResourceNotFoundError(`Income not found with id: ${id}`)
		}
		this.incomes.splice(index, 1)
	}
}
