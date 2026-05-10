import type { FastifyReply, FastifyRequest } from 'fastify'
import { incomeEntityToResponse } from '@/infra/http/mappers/income-to-response.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findIncomeByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const incomes = await container.findIncomeByMonth.execute(request.params.month, userId)
	reply.send(incomes.map((i) => incomeEntityToResponse(i)))
}
