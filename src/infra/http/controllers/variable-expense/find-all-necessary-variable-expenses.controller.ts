import type { FastifyReply, FastifyRequest } from 'fastify'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import { container } from '@/main/container.js'

export async function findAllNecessaryVariableExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const variableExpenses = await container.findAllNecessaryVariableExpenses.execute()
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
