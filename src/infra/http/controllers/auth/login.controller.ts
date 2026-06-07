import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/server.js'
import type { LoginRequest } from '../../schemas/auth/login.schema.js'

interface RequestType {
	Body: LoginRequest
}

export async function loginController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	const response = await container.login.execute({ ...request.body })
	reply.status(200).send(response)
}
