import { randomUUID } from 'node:crypto'
import { Income } from '@/domain/entities/income/income.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { PaginatedResult, PaginationInput } from '../../pagination.js'
import type { CreateIncomeInput } from '../dtos/create-income-input.dto.js'
import type { IncomeRepository } from '../income-repository.js'

export class InMemoryIncomeRepository implements IncomeRepository {
	public incomes: Income[] = []

	async findAll(userId: string, pagination?: PaginationInput): Promise<PaginatedResult<Income>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const filtered = this.incomes.filter((i) => i.userId === userId)
		const start = (page - 1) * limit

		return {
			data: filtered.slice(start, start + limit),
			total: filtered.length,
			page,
			limit,
		}
	}

	async findById(id: string, userId: string): Promise<Income | null> {
		return this.incomes.find((i) => i.id === id && i.userId === userId) ?? null
	}

	async findByNameAndMonth(name: string, month: string, userId: string): Promise<Income | null> {
		return this.incomes.find((i) => i.name === name && i.month === month && i.userId === userId) ?? null
	}

	async findByMonth(month: string, userId: string): Promise<Income[]> {
		return this.incomes.filter((i) => i.month === month && i.userId === userId)
	}

	async save(income: Income, userId: string): Promise<void> {
		const index = this.incomes.findIndex((i) => i.id === income.id && i.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Income not found with id: ${income.id}`)
		}

		this.incomes[index] = income
	}

	async create(data: CreateIncomeInput, userId: string): Promise<Income> {
		const income = new Income({
			id: randomUUID().toString(),
			...data,
			userId,
		})
		this.incomes.push(income)
		return income
	}

	async delete(id: string, userId: string): Promise<void> {
		const index = this.incomes.findIndex((i) => i.id === id && i.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Income not found with id: ${id}`)
		}
		this.incomes.splice(index, 1)
	}
}
