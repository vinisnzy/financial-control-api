import type { FastifyReply, FastifyRequest } from 'fastify'
import { UpdateVariableExpenseUseCase } from '@/application/use-cases/variable-expense/update-variable-expense.js'
import type { idParamRequest } from '@/infra/http/schemas/shared/id-param.schema.js'
import type { UpdateVariableExpenseRequest } from '@/infra/http/schemas/variable-expense/update-variable-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateVariableExpenseRequest
}

export async function updateVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
