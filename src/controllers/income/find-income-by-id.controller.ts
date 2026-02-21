import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { IncomeMapper } from '@/mappers/income.mapper.js'
import type { idParamRequest } from '@/schemas/shared/id-param.schema.js'
import { FindIncomeByIdUseCase } from '@/use-cases/income/find-income-by-id.js'

type RequestType = {
	Params: idParamRequest
}

export async function findIncomeByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomeByIdUseCase(container.incomeRepository)
	const income = await useCase.execute(request.params.id)
	reply.send(IncomeMapper.toResponse(income))
}
