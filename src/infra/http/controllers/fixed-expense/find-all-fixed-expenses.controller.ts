import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindAllFixedExpensesUseCase } from '@/application/use-cases/fixed-expense/find-all-fixed-expenses.js'
import { FixedExpenseMapper } from '@/infra/http/mappers/fixed-expense.mapper.js'
import { container } from '@/main/container.js'

export async function findAllFixedExpenseController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllFixedExpensesUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute()
	reply.send(expenses.map((e) => FixedExpenseMapper.toResponse(e)))
}
