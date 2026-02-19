import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindNecessaryVariableExpensesByMonthUseCase } from '@/use-cases/variable-expense/find-necessary-variable-expenses-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findNecessaryVariableExpensesByMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindNecessaryVariableExpensesByMonthUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute(request.params.month)
	reply.send(variableExpenses)
}
