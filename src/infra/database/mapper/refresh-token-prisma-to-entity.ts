import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import type { RefreshToken as RefreshTokenPrisma } from '@/generated/prisma/client.js'

export function refreshTokenPrismaToEntity(refreshToken: RefreshTokenPrisma) {
	return new RefreshToken({
		id: refreshToken.id,
		token: refreshToken.token,
		userId: refreshToken.userId,
		expiresAt: refreshToken.expiresAt,
		createdAt: refreshToken.createdAt,
	})
}
