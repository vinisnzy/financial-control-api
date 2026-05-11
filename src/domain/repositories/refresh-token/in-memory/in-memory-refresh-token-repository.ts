import { randomUUID } from 'node:crypto'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { CreateRefreshTokenInput } from '../dtos/create-refresh-token-input-dto.js'
import type { RefreshTokenRepository } from '../refresh-token-repository.js'

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
	private refreshTokens: RefreshToken[] = []
	async findByToken(token: string): Promise<RefreshToken | null> {
		return this.refreshTokens.find((rt) => rt.token === token) ?? null
	}
	async findByUserId(userId: string): Promise<RefreshToken[]> {
		return this.refreshTokens.filter((rt) => rt.userId === userId)
	}
	async create(data: CreateRefreshTokenInput): Promise<void> {
		const refreshToken = new RefreshToken({
			id: randomUUID().toString(),
			...data,
		})
		this.refreshTokens.push(refreshToken)
	}
	async save(refreshToken: RefreshToken, userId: string): Promise<void> {
		const index = this.refreshTokens.findIndex((rt) => rt.id === refreshToken.id && rt.userId === userId)
		if (index === -1) {
			throw new ResourceNotFoundError(`Refresh token not found with id: ${refreshToken.id}`)
		}

		this.refreshTokens[index] = refreshToken
	}
	async delete(id: string): Promise<void> {
		const index = this.refreshTokens.findIndex((rt) => rt.id === id)
		if (index === -1) {
			throw new ResourceNotFoundError(`Refresh token not found with id: ${id}`)
		}
		this.refreshTokens.splice(index, 1)
	}
}
