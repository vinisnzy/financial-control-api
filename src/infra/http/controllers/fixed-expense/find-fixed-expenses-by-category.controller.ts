import type { FastifyReply, FastifyRequest } from 'fastify'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import type { categoryParamRequest } from '@/infra/http/schemas/category-param.schema.js'
import { container } from '@/main/server.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findFixedExpensesByCategoryController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const expenses = await container.findFixedExpensesByCategory.execute(request.params.category, userId)
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
