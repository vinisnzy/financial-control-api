/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */

import type { VariableExpense } from '@/domain/entities/variable-expense/variable-expense.js'
import type { VariableExpenseResponseDTO } from '@/infra/http/dtos/variable-expense-response.dto.js'

export class VariableExpenseMapper {
	static toResponse(entity: VariableExpense): VariableExpenseResponseDTO {
		return {
			id: entity.id,
			month: entity.month,
			name: entity.name,
			amount: entity.amount,
			category: entity.category,
			necessary: entity.necessary,
			date: entity.date,
		}
	}
}
