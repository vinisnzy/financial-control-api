/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */

import type { FixedExpenseResponseDTO } from '@/dtos/fixed-expense-response.dto.js'
import type { FixedExpense } from '@/entities/fixed-expense/fixed-expense.js'

export class FixedExpenseMapper {
	static toResponse(entity: FixedExpense): FixedExpenseResponseDTO {
		return {
			id: entity.id,
			month: entity.month,
			name: entity.name,
			amount: entity.amount,
			category: entity.category,
			necessary: entity.necessary,
		}
	}
}
