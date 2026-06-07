import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/server.js'
import type { RefreshRequest } from '../../schemas/auth/refresh.schema.js'

interface RequestType {
	Body: RefreshRequest
}

export async function refreshController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const response = await container.refresh.execute(request.body.token)
	reply.status(200).send(response)
}
