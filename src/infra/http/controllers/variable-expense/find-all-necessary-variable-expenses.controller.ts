import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindAllNecessaryVariableExpensesUseCase } from '@/application/use-cases/variable-expense/find-all-necessary-variable-expenses.js'
import { variableExpenseEntityToResponse } from '@/infra/http/mappers/variable-expense-to-response.js'
import { container } from '@/main/container.js'

export async function findAllNecessaryVariableExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllNecessaryVariableExpensesUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute()
	reply.send(variableExpenses.map((e) => variableExpenseEntityToResponse(e)))
}
