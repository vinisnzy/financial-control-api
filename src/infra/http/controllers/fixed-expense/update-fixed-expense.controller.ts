import type { FastifyReply, FastifyRequest } from 'fastify'
import { UpdateFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/update-fixed-expense.js'
import type { UpdateFixedExpenseRequest } from '@/infra/http/schemas/fixed-expense/update-fixed-expense.schema.js'
import type { idParamRequest } from '@/infra/http/schemas/shared/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateFixedExpenseRequest
}

export async function updateFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
