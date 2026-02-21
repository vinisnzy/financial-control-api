import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateIncomeUseCase } from '@/application/use-cases/income/create-income.js'
import type { CreateIncomeRequest } from '@/infra/http/schemas/income/create-income.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateIncomeRequest
}

export async function createIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateIncomeUseCase(container.incomeRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
