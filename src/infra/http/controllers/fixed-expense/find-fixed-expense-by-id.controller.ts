import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindFixedExpenseByIdUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expense-by-id.js'
import { FixedExpenseMapper } from '@/infra/http/mappers/fixed-expense.mapper.js'
import type { idParamRequest } from '@/infra/http/schemas/shared/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function findFixedExpenseByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpenseByIdUseCase(container.fixedExpenseRepository)
	const income = await useCase.execute(request.params.id)
	reply.send(FixedExpenseMapper.toResponse(income))
}
