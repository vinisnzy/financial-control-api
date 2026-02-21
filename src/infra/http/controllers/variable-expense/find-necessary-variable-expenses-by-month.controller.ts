import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindNecessaryVariableExpensesByMonthUseCase } from '@/application/use-cases/variable-expense/find-necessary-variable-expenses-by-month.js'
import { VariableExpenseMapper } from '@/infra/http/mappers/variable-expense.mapper.js'
import type { monthParamRequest } from '@/infra/http/schemas/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findNecessaryVariableExpensesByMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindNecessaryVariableExpensesByMonthUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute(request.params.month)
	reply.send(variableExpenses.map((e) => VariableExpenseMapper.toResponse(e)))
}
