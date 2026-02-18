import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindAllVariableExpensesUseCase } from '@/use-cases/variable-expense/find-all-variable-expenses.js'

export async function findAllVariableExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllVariableExpensesUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute()
	reply.send(variableExpenses)
}
