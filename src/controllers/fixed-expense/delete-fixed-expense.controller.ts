import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { DeleteFixedExpenseUseCase } from '@/use-cases/fixed-expense/delete-fixed-expense.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function deleteFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
