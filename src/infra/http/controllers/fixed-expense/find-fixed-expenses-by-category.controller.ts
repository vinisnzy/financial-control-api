import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindFixedExpensesByCategoryUseCase } from '@/application/use-cases/fixed-expense/find-fixed-expenses-by-category.js'
import { FixedExpenseMapper } from '@/infra/http/mappers/fixed-expense.mapper.js'
import type { categoryParamRequest } from '@/infra/http/schemas/category-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findFixedExpensesByCategoryController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindFixedExpensesByCategoryUseCase(container.fixedExpenseRepository)
	const expenses = await useCase.execute(request.params.category)
	reply.send(expenses.map((e) => FixedExpenseMapper.toResponse(e)))
}
