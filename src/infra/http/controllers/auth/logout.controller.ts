import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/server.js'
import type { LogoutRequest } from '../../schemas/auth/logout.schema.js'

interface RequestType {
	Body: LogoutRequest
}

export async function logoutController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.logout.execute(request.body.token)
	reply.status(204).send()
}
