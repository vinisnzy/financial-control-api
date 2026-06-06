import { UnauthorizedError } from "@/domain/errors/unauthorized-error.js";
import { InMemoryRefreshTokenRepository } from "@/domain/repositories/refresh-token/in-memory/in-memory-refresh-token-repository.js";
import { InMemoryUserRepository } from "@/domain/repositories/user/in-memory/in-memory-user-repository.js";
import { TokenPayload } from "@/domain/services/token-service.js";
import { FastifyJwtTokenService } from "@/infra/services/fastify-jwt-token-service.js";
import { FastifyInstance } from "fastify";
import { describe, expect, it, vi } from "vitest";
import { RefreshUseCase } from "./refresh.js";
import { RefreshToken } from "@/generated/prisma/browser.js";

const mockApp = {
    jwt: {
        sign: (payload: TokenPayload, options: any) => `mock-token-${Date.now()}`,
        verify: (token: string) => {
            if(token === 'invalid-refresh-token') {
                throw new UnauthorizedError('Invalid token')
            }
            return { sub: 'user-id', email: 'test@gmail.com' }
        }
    }
} as unknown as FastifyInstance

describe('Refresh token use case', () => {
    it('should be return an new access and refresh token', async () => {
        const userRepository = new InMemoryUserRepository()
        const repository = new InMemoryRefreshTokenRepository()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')

        const user = await userRepository.create({
            email: 'test@gmail.com',
            password: 'testpassword',
            name: 'Test user'
        })

        const token = tokenService.signRefreshToken({ sub: user.id, email: user.email })
        
        await repository.create({
            token,
            userId: user.id,
            expiresAt: tokenService.getRefreshExpirationDate()
        })

        const refreshUseCase = new RefreshUseCase(repository, tokenService)

        const refreshTokenResponse = await refreshUseCase.execute(token)

        expect(refreshTokenResponse).toHaveProperty('accessToken')
        expect(refreshTokenResponse).toHaveProperty('refreshToken')
        expect(refreshTokenResponse.user.id).toBeDefined()
        expect(refreshTokenResponse.user.email).toBe('test@gmail.com')
    })

    it('should be throw an unauthorized error when refresh token not exists', async () => {
        const repository = new InMemoryRefreshTokenRepository()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')

        const refreshUseCase = new RefreshUseCase(repository, tokenService)

        const token = 'refresh-random-token'
        await expect(refreshUseCase.execute(token)).rejects.toThrow(UnauthorizedError)
    })

    it('should be throw an unauthorized error when token is expired', async () => {
        const repository = new InMemoryRefreshTokenRepository()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')

        const token = 'expired-token'
        const tokenId = 'token-id-123'
        const expiredToken = {
            id: tokenId,
            token,
            userId: 'user-id',
            expiresAt: new Date(Date.now() - 1000),
            createdAt: new Date()
        } as unknown as any

        vi.spyOn(repository, 'findByToken').mockResolvedValueOnce(expiredToken)
        const deleteSpy = vi.spyOn(repository, 'delete')

        const refreshUseCase = new RefreshUseCase(repository, tokenService)

        await expect(refreshUseCase.execute(token)).rejects.toThrow(UnauthorizedError)
        expect(deleteSpy).toHaveBeenCalledWith(tokenId)
    })

    it('should be throw an unauthorized error when token is invalid', async () => {
        const userRepository = new InMemoryUserRepository()
        const repository = new InMemoryRefreshTokenRepository()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')

        const user = await userRepository.create({
            email: 'test@gmail.com',
            password: 'testpassword',
            name: 'Test user'
        })

        const token = 'invalid-refresh-token'

        await repository.create({
            token,
            userId: user.id,
            expiresAt: tokenService.getRefreshExpirationDate()
        })

        const refreshUseCase = new RefreshUseCase(repository, tokenService)

        await expect(refreshUseCase.execute(token)).rejects.toThrow(UnauthorizedError)
    })
})