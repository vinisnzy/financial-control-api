import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { IncomeMapper } from '@/mappers/income.mapper.js'
import type { monthParamRequest } from '@/schemas/shared/month-param.schema.js'
import { FindIncomesByMonthUseCase } from '@/use-cases/income/find-income-by-month.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findIncomeByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomesByMonthUseCase(container.incomeRepository)
	const incomes = await useCase.execute(request.params.month)
	reply.send(incomes.map((i) => IncomeMapper.toResponse(i)))
}
