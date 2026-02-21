import type { FastifyReply, FastifyRequest } from 'fastify'
import { UpdateIncomeUseCase } from '@/application/use-cases/income/update-income.js'
import type { UpdateIncomeRequest } from '@/infra/http/schemas/income/update-income.schema.js'
import type { idParamRequest } from '@/infra/http/schemas/shared/id-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: idParamRequest
	Body: UpdateIncomeRequest
}

export async function updateIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateIncomeUseCase(container.incomeRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
