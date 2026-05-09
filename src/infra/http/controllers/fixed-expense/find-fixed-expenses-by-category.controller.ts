import type { FastifyReply, FastifyRequest } from 'fastify'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import type { categoryParamRequest } from '@/infra/http/schemas/category-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findFixedExpensesByCategoryController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const expenses = await container.findFixedExpensesByCategory.execute(request.params.category)
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
