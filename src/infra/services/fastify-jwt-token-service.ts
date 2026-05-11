import type { FastifyInstance } from 'fastify'
import type { TokenPayload, TokenService } from '@/domain/services/token-service.js'

export class FastifyJwtTokenService implements TokenService {
	constructor(
		private readonly app: FastifyInstance,
		private readonly accessExpiresIn: string,
		private readonly refreshExpiresIn: string,
	) {}

	signAccessToken(payload: TokenPayload): string {
		return this.app.jwt.sign(payload, { expiresIn: this.accessExpiresIn })
	}
	signRefreshToken(payload: TokenPayload): string {
		return this.app.jwt.sign(payload, { expiresIn: this.refreshExpiresIn })
	}
	verifyAccessToken(token: string): TokenPayload {
		return this.app.jwt.verify<TokenPayload>(token)
	}
	verifyRefreshToken(token: string): TokenPayload {
		return this.app.jwt.verify<TokenPayload>(token)
	}
	getRefreshExpirationDate(): Date {
		const days = parseInt(this.refreshExpiresIn.replace('d', ''), 10)
		return new Date(Date.now() + days * 24 * 60 * 1000)
	}
}
