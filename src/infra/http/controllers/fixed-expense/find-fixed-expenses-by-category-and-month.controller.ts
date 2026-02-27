import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindFixedExpensesByCategoryAndMonthUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-category-and-month.js'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import type { categoryAndMonthParamRequest } from '@/infra/http/schemas/category-and-month-params.schema.js'
import { container } from '@/main/container.js'

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
	reply.send(fixedExpenses.map((e) => fixedExpenseEntityToResponse(e)))
}
