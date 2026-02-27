import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindFixedExpenseByIdUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expense-by-id.js'
import type { idParamRequest } from '@/infra/http/schemas/id-param.schema.js'
import { container } from '@/main/container.js'
import { fixedExpenseEntityToResponse } from '../../mappers/fixed-expense-to-response.js'

type RequestType = {
	Params: idParamRequest
}

export async function findFixedExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpenseByIdUseCase(container.fixedExpenseRepository)
	const expense = await useCase.execute(request.params.id)
	reply.send(fixedExpenseEntityToResponse(expense))
}
