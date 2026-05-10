import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/container.js'

type RequestType = {
	Params: {
		id: string
	}
}

export async function deleteIncomeController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const userId = request.user.sub
	await container.deleteIncome.execute(request.params.id, userId)
	reply.status(204).send()
}
