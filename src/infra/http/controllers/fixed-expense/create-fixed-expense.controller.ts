import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateFixedExpenseUseCase } from '@/application/use-cases/fixed-expense/create-fixed-expense.js'
import type { CreateFixedExpenseRequest } from '@/infra/http/schemas/fixed-expense/create-fixed-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateFixedExpenseRequest
}

export async function createFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
