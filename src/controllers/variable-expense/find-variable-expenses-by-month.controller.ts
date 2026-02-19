import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindVariableExpensesByMonthUseCase } from '@/use-cases/variable-expense/find-variable-expenses-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findVariableExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpensesByMonthUseCase(container.variableExpenseRepository)
	const variableExpense = await useCase.execute(request.params.month)
	reply.send(variableExpense)
}
