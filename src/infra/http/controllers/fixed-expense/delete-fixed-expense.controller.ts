import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/delete-fixed-expense.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function deleteFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
