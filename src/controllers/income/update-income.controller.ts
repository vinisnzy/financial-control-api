import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { UpdateIncomeRequest } from '@/schemas/income/update-income.schema.js'
import { UpdateIncomeUseCase } from '@/use-cases/income/update-income.js'

type RequestType = {
	Params: {
		id: string
	}
	Body: UpdateIncomeRequest
}

export async function updateIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new UpdateIncomeUseCase(container.incomeRepository)
	await useCase.execute(request.params.id, request.body)
	reply.status(204).send()
}
