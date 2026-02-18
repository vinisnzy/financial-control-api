import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindVariableExpenseByIdUseCase } from '@/use-cases/variable-expense/find-variable-expense-by-id.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function findVariableExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindVariableExpenseByIdUseCase(container.variableExpenseRepository)
	const variableExpense = useCase.execute(request.params.id)
	reply.send(variableExpense)
}
