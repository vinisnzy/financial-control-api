import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindFixedExpenseByIdUseCase } from '@/use-cases/fixed-expense/find-fixed-expense-by-id.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function findFixedExpenseById(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpenseByIdUseCase(container.fixedExpenseRepository)
	const income = await useCase.execute(request.params.id)
	reply.send(income)
}
