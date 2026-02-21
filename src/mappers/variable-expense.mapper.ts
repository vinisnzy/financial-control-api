/** biome-ignore-all lint/complexity/noStaticOnlyClass: <explanation> */

import type { VariableExpenseResponseDTO } from '@/dtos/variable-expense-response.dto.js'
import type { VariableExpense } from '@/entities/variable-expense/variable-expense.js'

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
