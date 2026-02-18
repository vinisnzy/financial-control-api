import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { UpdateFixedExpenseRequest } from '@/schemas/fixed-expense/update-fixed-expense.schema.js'
import { UpdateFixedExpenseUseCase } from '@/use-cases/fixed-expense/update-fixed-expense.js'

type RequestType = {
	Params: {
		id: string
	}
	Body: UpdateFixedExpenseRequest
}

export async function updateFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
