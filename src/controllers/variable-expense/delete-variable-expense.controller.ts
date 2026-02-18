import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { DeleteVariableExpenseUseCase } from '@/use-cases/variable-expense/delete-variable-expense.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function deleteVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
