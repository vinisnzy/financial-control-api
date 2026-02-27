import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindVariableExpensesByMonthUseCase } from '@/application/use-cases/variable-expense/find-variable-expenses-by-month.js'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findVariableExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpensesByMonthUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute(request.params.month)
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
