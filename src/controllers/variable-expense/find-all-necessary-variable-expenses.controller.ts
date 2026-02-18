import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindAllNecessaryVariableExpensesUseCase } from '@/use-cases/variable-expense/find-all-necessary-variable-expenses.js'

export async function findAllNecessaryVariableExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllNecessaryVariableExpensesUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute()
	reply.send(variableExpenses)
}
