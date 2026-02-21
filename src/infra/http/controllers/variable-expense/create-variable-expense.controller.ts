import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateVariableExpenseUseCase } from '@/application/use-cases/variable-expense/create-variable-expense.js'
import type { CreateVariableExpenseRequest } from '@/infra/http/schemas/variable-expense/create-variable-expense.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Body: CreateVariableExpenseRequest
}

export async function createVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
