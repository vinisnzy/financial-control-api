import { httpErrors } from '@fastify/sensible'
import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import type { CreateRefreshTokenInput } from '@/domain/repositories/refresh-token/dtos/create-refresh-token-input-dto.js'
import type { RefreshTokenRepository } from '@/domain/repositories/refresh-token/refresh-token-repository.js'
import { prisma } from '../../lib/prisma.js'
import { refreshTokenPrismaToEntity } from '../../mapper/refresh-token-prisma-to-entity.js'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
	async findByToken(token: string): Promise<RefreshToken | null> {
		const refreshToken = await prisma.refreshToken.findUnique({
			where: { token },
		})
		if (!refreshToken) {
			return null
		}
		return refreshTokenPrismaToEntity(refreshToken)
	}
	async findByUserId(userId: string): Promise<RefreshToken[]> {
		const refreshTokens = await prisma.refreshToken.findMany({
			where: { userId },
		})
		return refreshTokens.map((rt) => refreshTokenPrismaToEntity(rt))
	}
	async create(data: CreateRefreshTokenInput): Promise<RefreshToken> {
		const refreshToken = await prisma.refreshToken.create({ data })
		return refreshTokenPrismaToEntity(refreshToken)
	}
	async delete(id: string): Promise<void> {
		const result = await prisma.refreshToken.delete({ where: { id } })
		if (!result) {
			throw httpErrors.notFound(`Refresh token not found with id: ${id}`)
		}
	}
}
