import type { FastifyReply, FastifyRequest } from 'fastify'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import type { UpdateIncomeRequest } from '@/infra/http/schemas/income/update-income.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateIncomeRequest
}

export async function updateIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.updateIncome.execute(request.params.id, userId, request.body)
	reply.status(204).send()
}
