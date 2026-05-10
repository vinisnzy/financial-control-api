import type { FastifyReply, FastifyRequest } from 'fastify'
import { incomeEntityToResponse } from '@/infra/http/mappers/income-to-response.js'
import { container } from '@/main/container.js'
import type { paginationParamRequest } from '../../schemas/pagination-param.schema.js'

type RequestType = {
	Querystring: paginationParamRequest
}

export async function findAllIncomesController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const { page, limit } = request.query
	const result = await container.findAllIncomes.execute(userId, { page, limit })
	reply.send({ ...result, data: result.data.map((i) => incomeEntityToResponse(i)) })
}
