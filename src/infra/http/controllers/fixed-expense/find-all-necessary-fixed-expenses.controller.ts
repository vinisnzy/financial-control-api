import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/container.js'
import { fixedExpenseEntityToResponse } from '../../mappers/fixed-expense-to-response.js'

export async function findAllNecessaryFixedExpensesController(request: FastifyRequest, reply: FastifyReply) {
	const userId = request.user.sub
	const expenses = await container.findAllNecessaryFixedExpenses.execute(userId)
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
