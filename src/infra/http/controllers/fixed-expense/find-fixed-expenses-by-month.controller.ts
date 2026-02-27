import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindFixedExpensesByMonthUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-month.js'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findFixedExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByMonthUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute(request.params.month)
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
