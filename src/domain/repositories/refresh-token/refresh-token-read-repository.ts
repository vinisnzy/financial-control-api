import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface RefreshTokenReadRepository {
	findAll(pagination?: PaginationInput): Promise<PaginatedResult<RefreshToken>>
	findByToken(token: string): Promise<RefreshToken>
	findByUserId(userId: string): Promise<RefreshToken[]>
}
