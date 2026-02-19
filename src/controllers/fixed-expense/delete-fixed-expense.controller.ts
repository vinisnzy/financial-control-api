import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { DeleteFixedExpenseUseCase } from '@/use-cases/fixed-expense/delete-fixed-expense.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
