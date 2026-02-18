import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { CreateIncomeRequest } from '@/schemas/income/create-income.schema.js'
import { CreateIncomeUseCase } from '@/use-cases/income/create-income.js'

type RequestType = {
	Body: CreateIncomeRequest
}

export async function createIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateIncomeUseCase(container.incomeRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
