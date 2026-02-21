import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindIncomesByMonthUseCase } from '@/application/use-cases/income/find-income-by-month.js'
import { IncomeMapper } from '@/infra/http/mappers/income.mapper.js'
import type { monthParamRequest } from '@/infra/http/schemas/shared/month-param.schema.js'
import { container } from '@/main/container.js'

type RequestType = {
	Params: monthParamRequest
}

export async function findIncomeByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomesByMonthUseCase(container.incomeRepository)
	const incomes = await useCase.execute(request.params.month)
	reply.send(incomes.map((i) => IncomeMapper.toResponse(i)))
}
