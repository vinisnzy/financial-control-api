import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { UpdateVariableExpenseRequest } from '@/schemas/variable-expense/update-variable-expense.schema.js'
import { UpdateVariableExpenseUseCase } from '@/use-cases/variable-expense/update-variable-expense.js'

type RequestType = {
	Body: UpdateVariableExpenseRequest
	Params: {
		id: string
	}
}

export async function updateVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
