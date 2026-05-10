import type { FastifyReply, FastifyRequest } from 'fastify'
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
	const userId = request.user.sub
	const { category, month } = request.params
	const fixedExpenses = await container.findFixedExpensesByCategoryAndMonth.execute(category, month, userId)
	reply.send(fixedExpenses.map((e) => fixedExpenseEntityToResponse(e)))
}
