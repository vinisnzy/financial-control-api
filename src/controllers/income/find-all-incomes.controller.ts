import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/container.js'
import { IncomeMapper } from '@/mappers/income.mapper.js'
import { FindAllIncomesUseCase } from '@/use-cases/income/find-all-incomes.js'

export async function findAllIncomesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllIncomesUseCase(container.incomeRepository)
	const incomes = await useCase.execute()
	reply.send(incomes.map((i) => IncomeMapper.toResponse(i)))
}
