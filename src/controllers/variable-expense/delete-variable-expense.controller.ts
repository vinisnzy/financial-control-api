import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { DeleteVariableExpenseUseCase } from '@/use-cases/variable-expense/delete-variable-expense.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
