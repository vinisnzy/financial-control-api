import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FixedExpenseMapper } from '@/mappers/fixed-expense.mapper.js'
import { FindAllNecessaryFixedExpensesUseCase } from '@/use-cases/fixed-expense/find-all-necessary-fixed-expenses.js'

export async function findAllNecessaryFixedExpensesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllNecessaryFixedExpensesUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute()
	reply.send(expenses.map((e) => FixedExpenseMapper.toResponse(e)))
}
