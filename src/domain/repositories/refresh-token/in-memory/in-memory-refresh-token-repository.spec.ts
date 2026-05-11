import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.js'
import { InMemoryRefreshTokenRepository } from './in-memory-refresh-token-repository.js'

const USER_ID = randomUUID()

function futureDate(offsetMs = 60_000) {
	return new Date(Date.now() + offsetMs)
}

describe('In memory refresh token repository', () => {
	it('should return null when findByToken finds no match', async () => {
		const repository = new InMemoryRefreshTokenRepository()

		const result = await repository.findByToken('non-existent-token')

		expect(result).toBeNull()
	})

	it('should return the refresh token when findByToken finds a match', async () => {
		const repository = new InMemoryRefreshTokenRepository()
		const token = 'valid-token'

		await repository.create({ token, userId: USER_ID, expiresAt: futureDate() })

		const result = await repository.findByToken(token)

		expect(result).not.toBeNull()
		expect(result?.token).toBe(token)
		expect(result?.userId).toBe(USER_ID)
	})

	it('should return empty array when findByUserId finds no tokens', async () => {
		const repository = new InMemoryRefreshTokenRepository()

		const result = await repository.findByUserId(USER_ID)

		expect(result).toHaveLength(0)
		expect(result).toEqual([])
	})

	it('should return only tokens belonging to the given userId', async () => {
		const repository = new InMemoryRefreshTokenRepository()
		const otherUserId = randomUUID()

		await repository.create({ token: 'token-a', userId: USER_ID, expiresAt: futureDate() })
		await repository.create({ token: 'token-b', userId: USER_ID, expiresAt: futureDate() })
		await repository.create({ token: 'token-c', userId: otherUserId, expiresAt: futureDate() })

		const result = await repository.findByUserId(USER_ID)

		expect(result).toHaveLength(2)
		expect(result.every((rt) => rt.userId === USER_ID)).toBe(true)
	})

	it('should create a refresh token', async () => {
		const repository = new InMemoryRefreshTokenRepository()
		const token = 'new-token'

		await repository.create({ token, userId: USER_ID, expiresAt: futureDate() })

		const result = await repository.findByToken(token)
		expect(result).not.toBeNull()
		expect(result?.token).toBe(token)
	})

	it('should save an updated refresh token', async () => {
		const repository = new InMemoryRefreshTokenRepository()

		await repository.create({ token: 'original-token', userId: USER_ID, expiresAt: futureDate() })

		const created = await repository.findByToken('original-token')
		if (!created) throw new Error('Refresh token not found in test')

		const newExpiresAt = futureDate(120_000)
		const updated = new RefreshToken({
			id: created.id,
			token: 'updated-token',
			userId: USER_ID,
			expiresAt: newExpiresAt,
		})

		await repository.save(updated, USER_ID)

		const result = await repository.findByToken('updated-token')
		expect(result).not.toBeNull()
		expect(result?.token).toBe('updated-token')
		expect(result?.expiresAt).toEqual(newExpiresAt)
	})

	it('should throw when saving a non-existent refresh token', async () => {
		const repository = new InMemoryRefreshTokenRepository()

		const refreshToken = new RefreshToken({
			id: randomUUID(),
			token: 'ghost-token',
			userId: USER_ID,
			expiresAt: futureDate(),
		})

		await expect(repository.save(refreshToken, USER_ID)).rejects.toThrow()
	})

	it('should delete a refresh token', async () => {
		const repository = new InMemoryRefreshTokenRepository()
		const token = 'to-be-deleted'

		await repository.create({ token, userId: USER_ID, expiresAt: futureDate() })

		const created = await repository.findByToken(token)
		if (!created) throw new Error('Refresh token not found in test')

		await repository.delete(created.id)

		const result = await repository.findByToken(token)
		expect(result).toBeNull()
	})

	it('should throw when deleting a non-existent refresh token', async () => {
		const repository = new InMemoryRefreshTokenRepository()

		await expect(repository.delete('non-existent-id')).rejects.toThrow(
			'Refresh token not found with id: non-existent-id',
		)
	})
})
