import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindVariableExpensesByCategoryUseCase } from '@/application/use-cases/variable-expense/find-variable-expense-by-category.js'
import { VariableExpenseMapper } from '@/infra/http/mappers/variable-expense.mapper.js'
import type { categoryParamRequest } from '@/infra/http/schemas/shared/category-param.schema.js'
import { container } from '@/main/container.js'

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
