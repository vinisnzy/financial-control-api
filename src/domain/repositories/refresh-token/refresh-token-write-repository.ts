import type { CreateRefreshTokenInput } from './dtos/create-refresh-token-input-dto.js'

export interface RefreshTokenWriteRepository {
	create(data: CreateRefreshTokenInput): Promise<void>
	delete(id: string): Promise<void>
}
