import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import { container } from '@/main/server.js'

export async function findAllNecessaryVariableExpensesController(request: FastifyRequest, reply: FastifyReply) {
	const userId = request.user.sub
	const variableExpenses = await container.findAllNecessaryVariableExpenses.execute(userId)
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
