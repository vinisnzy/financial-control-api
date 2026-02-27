import type { FixedExpense } from '@/domain/entities/fixed-expense/fixed-expense.js'
import type { FixedExpenseResponseDTO } from '@/infra/http/dtos/fixed-expense-response.dto.js'

export function fixedExpenseEntityToResponse(entity: FixedExpense): FixedExpenseResponseDTO {
	return {
		id: entity.id,
		month: entity.month,
		name: entity.name,
		amount: entity.amount,
		category: entity.category,
		necessary: entity.necessary,
	}
}
