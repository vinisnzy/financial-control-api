/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */

import type { IncomeResponseDTO } from '@/dtos/income-response.dto.js'
import type { Income } from '@/entities/income/income.js'

export class IncomeMapper {
	static toResponse(entity: Income): IncomeResponseDTO {
		return {
			id: entity.id,
			name: entity.name,
			month: entity.month,
			amount: entity.amount,
		}
	}
}
