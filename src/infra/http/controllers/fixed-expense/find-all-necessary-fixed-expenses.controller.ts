import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/container.js'
import { fixedExpenseEntityToResponse } from '../../mappers/fixed-expense-to-response.js'

export async function findAllNecessaryFixedExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const expenses = await container.findAllNecessaryFixedExpenses.execute()
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
