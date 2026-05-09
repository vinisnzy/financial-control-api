import type { FastifyReply, FastifyRequest } from 'fastify'
import { fixedExpenseEntityToResponse } from '@/infra/http/mappers/fixed-expense-to-response.js'
import { container } from '@/main/container.js'

export async function findAllFixedExpenseController(_: FastifyRequest, reply: FastifyReply) {
	const expenses = await container.findAllFixedExpenses.execute()
	reply.send(expenses.map((e) => fixedExpenseEntityToResponse(e)))
}
