import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindIncomeByIdUseCase } from '@/use-cases/income/find-income-by-id.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function findIncomeByIdController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new FindIncomeByIdUseCase(container.incomeRepository)
	const income = useCase.execute(request.params.id)
	reply.send(income)
}
