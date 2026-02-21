import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindIncomeByIdUseCase } from '@/application/use-cases/income/find-income-by-id.js'
import { IncomeMapper } from '@/infra/http/mappers/income.mapper.js'
import type { idParamRequest } from '@/infra/http/schemas/shared/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
}

export async function findIncomeByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomeByIdUseCase(container.incomeRepository)
	const income = await useCase.execute(request.params.id)
	reply.send(IncomeMapper.toResponse(income))
}
