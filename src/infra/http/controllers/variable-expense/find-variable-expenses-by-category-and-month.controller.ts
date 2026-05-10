import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { categoryAndMonthParamRequest } from '@/infra/http/schemas/category-and-month-params.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: categoryAndMonthParamRequest
}

export async function findVariableExpensesByCategoryAndMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const userId = request.user.sub
	const { category, month } = request.params
	const variableExpenses = await container.findVariableExpensesByCategoryAndMonth.execute(category, month, userId)
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
