import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { FindFixedExpenseByIdUseCase } from '@/use-cases/fixed-expense/find-fixed-expense-by-id.js'

type RequestType = {
	Params: idParamRequest
}

export async function findFixedExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpenseByIdUseCase(container.fixedExpenseRepository)
	const income = await useCase.execute(request.params.id)
	reply.send(income)
}
