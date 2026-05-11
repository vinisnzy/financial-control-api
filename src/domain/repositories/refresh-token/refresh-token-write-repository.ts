import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import type { CreateRefreshTokenInput } from './dtos/create-refresh-token-input-dto.js'

export interface RefreshTokenWriteRepository {
	create(data: CreateRefreshTokenInput): Promise<void>
	save(refreshToken: RefreshToken, userId: string): Promise<void>
	delete(id: string): Promise<void>
}
