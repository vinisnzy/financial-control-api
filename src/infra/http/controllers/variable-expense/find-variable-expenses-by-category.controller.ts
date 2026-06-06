import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { categoryParamRequest } from '@/infra/http/schemas/category-param.schema.js'
import { container } from '@/main/server.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findVariableExpensesByCategoryController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const userId = request.user.sub
	const variableExpenses = await container.findVariableExpenseByCategory.execute(request.params.category, userId)
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
