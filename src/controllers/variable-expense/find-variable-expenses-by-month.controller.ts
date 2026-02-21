import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { VariableExpenseMapper } from '@/mappers/variable-expense.mapper.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindVariableExpensesByMonthUseCase } from '@/use-cases/variable-expense/find-variable-expenses-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findVariableExpensesByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpensesByMonthUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute(request.params.month)
	reply.send(variableExpenses.map((e) => VariableExpenseMapper.toResponse(e)))
}
