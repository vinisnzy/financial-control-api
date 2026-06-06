import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error.js";
import { RefreshTokenRepository } from "@/domain/repositories/refresh-token/refresh-token-repository.js";
import { UserRepository } from "@/domain/repositories/user/user-repository.js";
import { HashService } from "@/domain/services/hash-service.js";
import { TokenPayload, TokenService } from "@/domain/services/token-service.js";

interface LoginRequest {
    email: string,
    password: string
}

interface LoginResponse {
    accessToken: string,
    refreshToken: string
    user: {
        id: string
        email: string,
        name: string
    }
}

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
        private readonly tokenService: TokenService,
        private readonly hashService: HashService
    ) {}

    async execute({ email, password }: LoginRequest): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new InvalidCredentialsError()
        if (!(await this.hashService.compare(password, user.password))) throw new InvalidCredentialsError()

        const payload: TokenPayload = {sub: user.id, email: user.email}
        const accessToken = this.tokenService.signAccessToken(payload)
        const refreshToken = this.tokenService.signRefreshToken(payload)

        await this.refreshTokenRepository.create({
            token: refreshToken,
            userId: user.id,
            expiresAt: this.tokenService.getRefreshExpirationDate()
        })

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        }
    }
}