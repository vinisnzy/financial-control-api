import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import type { CreateRefreshTokenInput } from './dtos/create-refresh-token-input-dto.js'

export interface RefreshTokenWriteRepository {
	create(data: CreateRefreshTokenInput): Promise<RefreshToken>
	delete(id: string): Promise<void>
}
