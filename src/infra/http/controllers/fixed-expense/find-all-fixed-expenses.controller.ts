import type { FastifyReply, FastifyRequest } from 'fastify'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import { container } from '@/main/container.js'
import type { paginationParamRequest } from '../../schemas/pagination-param.schema.js'

type RequestType = {
	Querystring: paginationParamRequest
}

export async function findAllFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const { page, limit } = request.query
	const result = await container.findAllFixedExpenses.execute(userId, { page, limit })
	reply.send({ ...result, data: result.data.map((i) => fixedExpenseEntityToResponse(i)) })
}
