import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'

export interface RefreshTokenReadRepository {
	findByToken(token: string): Promise<RefreshToken | null>
	findByUserId(userId: string): Promise<RefreshToken[]>
}
