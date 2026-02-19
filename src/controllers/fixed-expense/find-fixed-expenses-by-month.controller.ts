import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindFixedExpensesByMonthUseCase } from '@/use-cases/fixed-expense/find-fixed-expenses-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findFixedExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByMonthUseCase(container.fixedExpenseRepository)
	const incomes = await useCase.execute(request.params.month)
	reply.send(incomes)
}
