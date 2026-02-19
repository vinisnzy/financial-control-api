import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindNecessaryFixedExpensesByMonthUseCase } from '@/use-cases/fixed-expense/find-necessary-fixed-expenses-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findNecessaryFixedExpensesByMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindNecessaryFixedExpensesByMonthUseCase(container.fixedExpenseRepository)
	const fixedExpenses = await useCase.execute(request.params.month)
	reply.send(fixedExpenses)
}
