export type {}

declare module 'fastify' {
	interface FastifyRequest {
		user: {
			sub: string
		}
	}
}
