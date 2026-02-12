import { randomUUID } from 'node:crypto'
import { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

interface CreateIncomeRequest {
	name: string
	month: string
	amount: number
}

export class CreateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: CreateIncomeRequest): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new Error(`There is already a recipe with the name: ${name}, and the month: ${month}`)
		}
		await this.repository.create(
			new Income({
				id: randomUUID().toString(),
				...request,
			}),
		)
	}
}
