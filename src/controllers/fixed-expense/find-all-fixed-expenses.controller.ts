import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FixedExpenseMapper } from '@/mappers/fixed-expense.mapper.js'
import { FindAllFixedExpensesUseCase } from '@/use-cases/fixed-expense/find-all-fixed-expenses.js'

export async function findAllFixedExpenseController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllFixedExpensesUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute()
	reply.send(expenses.map((e) => FixedExpenseMapper.toResponse(e)))
}
