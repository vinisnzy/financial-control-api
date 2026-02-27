import { Income } from '@/domain/entities/income/income.js'
import type { Income as IncomePrisma } from '@/generated/prisma/client.js'

export function incomePrismaToEntity(income: IncomePrisma): Income {
	return new Income({
		id: income.id,
		name: income.name,
		month: income.month,
		amount: Number(income.amount),
	})
}
