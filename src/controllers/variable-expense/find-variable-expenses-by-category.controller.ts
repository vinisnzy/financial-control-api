import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { VariableExpenseMapper } from '@/mappers/variable-expense.mapper.js'
import type { categoryParamRequest } from '@/schemas/shared/category-param.schema.js'
import { FindVariableExpensesByCategoryUseCase } from '@/use-cases/variable-expense/find-variable-expense-by-category.js'

type RequestType = {
	Params: categoryParamRequest
}

export async function findVariableExpensesByCategoryController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindVariableExpensesByCategoryUseCase(container.variableExpenseRepository)
	const variableExpenses = await useCase.execute(request.params.category)
	reply.send(variableExpenses.map((e) => VariableExpenseMapper.toResponse(e)))
}
