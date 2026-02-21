import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteVariableExpenseUseCase } from '@/application/use-cases/variable-expense/delete-variable-expense.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
