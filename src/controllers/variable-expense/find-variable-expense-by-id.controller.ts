import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { VariableExpenseMapper } from '@/mappers/variable-expense.mapper.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { FindVariableExpenseByIdUseCase } from '@/use-cases/variable-expense/find-variable-expense-by-id.js'

type RequestType = {
	Params: idParamRequest
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpenseByIdUseCase(container.variableExpenseRepository)
	const variableExpense = await useCase.execute(request.params.id)
	reply.send(VariableExpenseMapper.toResponse(variableExpense))
}
