import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import type { categoryAndMonthParamRequest } from '@/schemas/shared/category-and-month-params.schema.js'
import { FindVariableExpensesByCategoryAndMonthUseCase } from '@/use-cases/variable-expense/find-variable-expenses-by-category-and-month.js'

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
	reply.send(variableExpenses)
}
