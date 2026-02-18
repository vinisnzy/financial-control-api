import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindIncomesByMonthUseCase } from '@/use-cases/income/find-income-by-month.js'

type RequestType = {
	Params: {
		month: string
	}
}

export async function findIncomeByMonthController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomesByMonthUseCase(container.incomeRepository)
	const incomes = await useCase.execute(request.params.month)
	reply.send(incomes)
}
