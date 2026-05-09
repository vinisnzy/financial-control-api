import type { FastifyReply, FastifyRequest } from 'fastify'
import { incomeEntityToResponse } from '@/infra/http/mappers/income-to-response.js'
import { container } from '@/main/container.js'

export async function findAllIncomesController(_: FastifyRequest, reply: FastifyReply) {
	const incomes = await container.findAllIncomes.execute()
	reply.send(incomes.map((i) => incomeEntityToResponse(i)))
}
