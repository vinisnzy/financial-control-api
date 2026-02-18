import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindFixedExpensesByMonthUseCase } from '@/use-cases/fixed-expense/find-fixed-expenses-by-month.js'

type RequestType = {
	Params: {
		month: string
	}
}

export async function findFixedExpensesByMonth(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByMonthUseCase(container.fixedExpenseRepository)
	const incomes = await useCase.execute(request.params.month)
	reply.send(incomes)
}
