import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/container.js'
import { incomeEntityToResponse } from '../../mappers/income-to-response.js'
import type { nameAndMonthParamRequest } from '../../schemas/name-and-month-param.schema.js'

type RequestType = {
	Params: nameAndMonthParamRequest
}

export async function findIncomeByNameAndMonth(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	const income = await container.findIncomeByNameAndMonth.execute(request.params.name, request.params.month, userId)
	reply.send(incomeEntityToResponse(income))
}
