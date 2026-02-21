import type { FastifyReply, FastifyRequest } from 'fastify'
import { FindAllIncomesUseCase } from '@/application/use-cases/income/find-all-incomes.js'
import { IncomeMapper } from '@/infra/http/mappers/income.mapper.js'
import { container } from '@/main/container.js'

export async function findAllIncomesController(_: FastifyRequest, reply: FastifyReply) {
	const useCase = new FindAllIncomesUseCase(container.incomeRepository)
	const incomes = await useCase.execute()
	reply.send(incomes.map((i) => IncomeMapper.toResponse(i)))
}
