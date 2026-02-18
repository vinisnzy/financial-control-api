import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { ExpenseCategory } from '@/enums/expense-category.js'
import { FindFixedExpensesByCategoryUseCase } from '@/use-cases/fixed-expense/find-fixed-expenses-by-category.js'

type RequestType = {
	Params: {
		category: ExpenseCategory
	}
}

export async function findFixedExpensesByCategory(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByCategoryUseCase(container.fixedExpenseRepository)
	const incomes = await useCase.execute(request.params.category)
	reply.send(incomes)
}
