import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindVariableExpenseByIdUseCase } from '@/application/use-cases/variable-expense/find-variable-expense-by-id.js'
import { VariableExpenseMapper } from '@/infra/http/mappers/variable-expense.mapper.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpenseByIdUseCase(container.variableExpenseRepository)
	const variableExpense = await useCase.execute(request.params.id)
	reply.send(VariableExpenseMapper.toResponse(variableExpense))
}
