import type { FastifyReply, FastifyRequest } from 'fastify'
import { incomeEntityToResponse } from '@/infra/http/mappers/income-to-response.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function findIncomeByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const income = await container.findIncomeById.execute(request.params.id)
	reply.send(incomeEntityToResponse(income))
}
