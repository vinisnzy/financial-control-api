import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { DeleteIncomeUseCase } from '@/use-cases/income/delete-income.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function deleteIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const useCase = new DeleteIncomeUseCase(container.incomeRepository)
	await useCase.execute(request.params.id)
	reply.status(204).send()
}
