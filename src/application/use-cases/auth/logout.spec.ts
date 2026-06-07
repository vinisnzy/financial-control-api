import { describe, expect, it } from 'vitest'
import { InMemoryRefreshTokenRepository } from '@/domain/repositories/refresh-token/in-memory/in-memory-refresh-token-repository.js'
import { InMemoryUserRepository } from '@/domain/repositories/user/in-memory/in-memory-user-repository.js'
import { LogoutUseCase } from './logout.js'

const token = 'random-refresh-token'

describe('Logout use case', () => {
	it('should delete refresh token', async () => {
		const userRepository = new InMemoryUserRepository()
		const repository = new InMemoryRefreshTokenRepository()

		const user = await userRepository.create({
			email: 'test@gmail.com',
			password: 'testpassword',
			name: 'Test user',
		})

		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + 7)
		await repository.create({
			token,
			userId: user.id,
			expiresAt,
		})

		const logoutUseCase = new LogoutUseCase(repository)

		await logoutUseCase.execute(token)

		expect(await repository.findByToken(token)).toBeNull()
	})
})
