import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindVariableExpensesByCategoryAndMonthUseCase } from '@/application/use-cases/variable-expense/find-variable-expenses-by-category-and-month.js'
import { VariableExpenseMapper } from '@/infra/http/mappers/variable-expense.mapper.js'
import type { categoryAndMonthParamRequest } from '@/infra/http/schemas/shared/category-and-month-params.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: categoryAndMonthParamRequest
}

export async function findVariableExpensesByCategoryAndMonthController(
	request: FastifyRequest<RequestType>,
	reply: FastifyReply,
) {
	const useCase = new FindVariableExpensesByCategoryAndMonthUseCase(container.variableExpenseRepository)
	const { category, month } = request.params
	const variableExpenses = await useCase.execute(category, month)
	reply.send(variableExpenses.map((e) => VariableExpenseMapper.toResponse(e)))
}
