import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FixedExpenseMapper } from '@/mappers/fixed-expense.mapper.js'
import type { categoryParamRequest } from '@/schemas/shared/category-param.schema.js'
import { FindFixedExpensesByCategoryUseCase } from '@/use-cases/fixed-expense/find-fixed-expenses-by-category.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findFixedExpensesByCategory(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByCategoryUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute(request.params.category)
	reply.send(expenses.map((e) => FixedExpenseMapper.toResponse(e)))
}
