import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindAllVariableExpensesUseCase } from '@/application/use-cases/variable-expense/find-all-variable-expenses.js'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import { container } from '@/main/container.js'

export async function findAllVariableExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllVariableExpensesUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute()
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
