import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { CreateVariableExpenseRequest } from '@/schemas/variable-expense/create-variable-expense.schema.js'
import { CreateVariableExpenseUseCase } from '@/use-cases/variable-expense/create-variable-expense.js'

type RequestType = {
	Body: CreateVariableExpenseRequest
}

export async function CreateVariableExpenseController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new CreateVariableExpenseUseCase(container.variableExpenseRepository)
	await useCase.execute(request.body)
	reply.status(201).send()
}
