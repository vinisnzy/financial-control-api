import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { categoryAndMonthParamRequest } from '@/schemas/shared/category-and-month-params.schema.js'
import { FindFixedExpensesByCategoryAndMonthUseCase } from '@/use-cases/fixed-expense/find-fixed-expenses-by-category-and-month.js'

type RequestType = {
	Params: categoryAndMonthParamRequest
}

export async function findFixedExpensesByCategoryAndMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindFixedExpensesByCategoryAndMonthUseCase(container.fixedExpenseRepository)
	const { category, month } = request.params
	const fixedExpenses = await useCase.execute(category, month)
	reply.send(fixedExpenses)
}
