import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { FindAllIncomesUseCase } from '@/use-cases/income/find-all-incomes.js'

export async function findAllIncomesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllIncomesUseCase(container.incomeRepository)
	const incomes = await useCase.execute()
	reply.send(incomes)
}
