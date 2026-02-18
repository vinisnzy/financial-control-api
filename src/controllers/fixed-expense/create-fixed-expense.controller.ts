import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { CreateFixedExpenseRequest } from '@/schemas/fixed-expense/create-fixed-expense.schema.js'
import { CreateFixedExpenseUseCase } from '@/use-cases/fixed-expense/create-fixed-expense.js'

type RequestType = {
	Body: CreateFixedExpenseRequest
}

export async function createFixedExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateFixedExpenseUseCase(container.fixedExpenseRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
