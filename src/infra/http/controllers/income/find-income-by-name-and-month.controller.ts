import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindIncomeByNameAndMonthUseCase } from '@/application/use-cases/income/find-income-by-name-and-month.js'
import { container } from '@/main/container.js'
import { incomeEntityToResponse } from '../../mappers/income-to-response.js'
import type { nameAndMonthParamRequest } from '../../schemas/name-and-month-param.schema.js'

type RequestType = {
	Params: nameAndMonthParamRequest
}

export async function findIncomeByNameAndMonth(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomeByNameAndMonthUseCase(container.incomeRepository)
	const income = await useCase.execute(request.params.name, request.params.month)
	reply.send(incomeEntityToResponse(income))
}
