import { UnauthorizedError } from "@/domain/errors/unauthorized-error.js";
import { RefreshTokenRepository } from "@/domain/repositories/refresh-token/refresh-token-repository.js";
import { TokenService } from "@/domain/services/token-service.js";

interface RefreshResponse {
    accessToken: string
    refreshToken: string
    user: {
        id: string
        email: string
    }
}

export class RefreshUseCase {
    constructor(
        private readonly repository: RefreshTokenRepository,
        private readonly tokenService: TokenService
    ) {}

    async execute(token: string): Promise<RefreshResponse> {
        const existingToken = await this.repository.findByToken(token)
        if (!existingToken) throw new UnauthorizedError('Invalid refresh token')
        if (existingToken.expiresAt < new Date()) {
            this.repository.delete(existingToken.id)
            throw new UnauthorizedError('Refresh token expired')
        }

        let payload
        try {
            payload = this.tokenService.verifyRefreshToken(token)
        } catch {
            throw new UnauthorizedError('Invalid refresh token')
        }

        const accessToken = this.tokenService.signAccessToken({ sub: payload.sub, email: payload.email })
        const refreshToken = this.tokenService.signRefreshToken({ sub: payload.sub, email: payload.email })
        return {
            accessToken,
            refreshToken,
            user: {
                id: payload.sub,
                email: payload.email
            }
        }
    }
}