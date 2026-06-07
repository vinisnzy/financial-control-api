import type { RefreshTokenRepository } from '@/domain/repositories/refresh-token/refresh-token-repository.js'

export class LogoutUseCase {
	constructor(private readonly repository: RefreshTokenRepository) {}

	async execute(token: string): Promise<void> {
		const refreshToken = await this.repository.findByToken(token)
		if (!refreshToken) return
		await this.repository.delete(refreshToken.id)
	}
}
