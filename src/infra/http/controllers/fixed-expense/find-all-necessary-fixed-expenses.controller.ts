import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindAllNecessaryFixedExpensesUseCase } from '@/application/use-cases/fixed-expense/find-all-necessary-fixed-expenses.js'
import { container } from '@/main/container.js'
import { fixedExpenseEntityToResponse } from '../../mappers/fixed-expense-to-response.js'

export async function findAllNecessaryFixedExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllNecessaryFixedExpensesUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute()
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
