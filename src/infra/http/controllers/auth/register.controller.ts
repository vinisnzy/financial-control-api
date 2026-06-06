import type { FastifyReply, FastifyRequest } from 'fastify'
import { container } from '@/main/server.js'
import type { RegisterRequest } from '../../schemas/auth/register.schema.js'

type RequestType = {
	Body: RegisterRequest
}

export async function RegisterController(request: FastifyRequest<RequestType>, reply: FastifyReply) {
	await container.register.execute(request.body)
	reply.status(201).send()
}
