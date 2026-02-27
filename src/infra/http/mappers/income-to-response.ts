import type { Income } from '@/domain/entities/income/income.js'
import type { IncomeResponseDTO } from '@/infra/http/dtos/income-response.dto.js'

export function incomeEntityToResponse(entity: Income): IncomeResponseDTO {
	return {
		id: entity.id,
		name: entity.name,
		month: entity.month,
		amount: entity.amount,
	}
}
