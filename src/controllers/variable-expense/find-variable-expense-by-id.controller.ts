import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { FindVariableExpenseByIdUseCase } from '@/use-cases/variable-expense/find-variable-expense-by-id.js'

type RequestType = {
	Params: idParamRequest
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpenseByIdUseCase(container.variableExpenseRepository)
	const variableExpense = useCase.execute(request.params.id)
	reply.send(variableExpense)
}
