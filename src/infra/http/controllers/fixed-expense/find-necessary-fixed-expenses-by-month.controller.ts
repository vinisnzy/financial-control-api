import type { FastifyReply, FastifyRequest } from 'fastify'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findNecessaryFixedExpensesByMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const expenses = await container.findNecessaryFixedExpensesByMonth.execute(request.params.month)
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
