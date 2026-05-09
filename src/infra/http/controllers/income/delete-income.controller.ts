import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/container.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function deleteIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.deleteIncome.execute(request.params.id)
	reply.status(204).send()
}
