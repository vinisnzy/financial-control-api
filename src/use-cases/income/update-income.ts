import { Income } from '@/entities/income/income.js'
import type { IncomeRepository } from '@/repositories/income/income-repository.js'

interface UpdateIncomeRequest {
	id: string
	name: string
	month: string
	amount: number
}

export class UpdateIncomeUseCase {
	constructor(private repository: IncomeRepository) {}

	async execute(request: UpdateIncomeRequest): Promise<void> {
		const { name, month } = request
		const alreadyExists = await this.repository.findByNameAndMonth(name, month)
		if (alreadyExists) {
			throw new Error(`There is already a recipe with the name: ${name}, and the month: ${month}`)
		}
		await this.repository.save(new Income({ ...request }))
	}
}
