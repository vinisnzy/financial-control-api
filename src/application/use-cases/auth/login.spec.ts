import { User } from "@/domain/entities/user/user.js";
import { InMemoryRefreshTokenRepository } from "@/domain/repositories/refresh-token/in-memory/in-memory-refresh-token-repository.js";
import { InMemoryUserRepository } from "@/domain/repositories/user/in-memory/in-memory-user-repository.js";
import { TokenPayload } from "@/domain/services/token-service.js";
import { BCryptHashService } from "@/infra/services/bcrypt-hash-service.js";
import { FastifyJwtTokenService } from "@/infra/services/fastify-jwt-token-service.js";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { LoginUseCase } from "./login.js";
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error.js";

const mockApp = {
    jwt: {
        sign: (payload: TokenPayload, options: any) => `mock-token-${Date.now()}`,
        verify: (token: string) => ({ sub: 'user-id' })
    }
} as unknown as FastifyInstance

describe('Login use case', () => {
    it('should returns an access and refresh token', async () => {
        const userRepository = new InMemoryUserRepository()
        const refreshTokenRepository = new InMemoryRefreshTokenRepository()
        const hashService = new BCryptHashService()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')
        const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, tokenService, hashService)
        
        const email = 'test@gmail.com'
        const password = 'testpassword'
        const hashedPassword = await hashService.hash(password)
        await userRepository.create({
            email,
            password: hashedPassword,
            name: 'Test user'
        })

        const loginResponse = await loginUseCase.execute({ email, password })

        expect(loginResponse).toHaveProperty('accessToken')
        expect(loginResponse).toHaveProperty('refreshToken')
        expect(loginResponse.user.email).toBe('test@gmail.com')
        expect(loginResponse.user.name).toBe('Test user')
        expect(loginResponse.user.id).toBeDefined()
    })

    it('should be throw an invalid credentials error when not exists an user with provided email', async () => {
        const userRepository = new InMemoryUserRepository()
        const refreshTokenRepository = new InMemoryRefreshTokenRepository()
        const hashService = new BCryptHashService()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')
        
        const email = 'test@gmail.com'
        const password = 'testpassword'

        const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, tokenService, hashService)

        await expect(loginUseCase.execute({email, password})).rejects.toThrow(InvalidCredentialsError)
    })

    it('should be throw an invalid credentials error when provided password is incorrect', async () => {
        const userRepository = new InMemoryUserRepository()
        const refreshTokenRepository = new InMemoryRefreshTokenRepository()
        const hashService = new BCryptHashService()
        const tokenService = new FastifyJwtTokenService(mockApp, '15m', '7d')
        
        const email = 'test@gmail.com'
        const password = 'testpassword'
        const hashedPassword = await hashService.hash(password)
        await userRepository.create({
            email,
            password: hashedPassword,
            name: 'Test user'
        })

        const incorrectPassword = 'incorrectpassword'

        const loginUseCase = new LoginUseCase(userRepository, refreshTokenRepository, tokenService, hashService)

        await expect(loginUseCase.execute({email, password: incorrectPassword})).rejects.toThrow(InvalidCredentialsError)
    })
})