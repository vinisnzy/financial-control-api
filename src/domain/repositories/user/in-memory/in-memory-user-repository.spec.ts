import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { User } from '@/domain/entities/user/user.js'
import { InMemoryUserRepository } from './in-memory-user-repository.js'

const BASE_USER = {
	email: 'john@example.com',
	password: 'hashed-password',
	name: 'John Doe',
}

describe('In memory user repository', () => {
	it('should return an empty list when there are no users', async () => {
		const repository = new InMemoryUserRepository()

		const result = await repository.findAll()

		expect(result.data).toHaveLength(0)
		expect(result.data).toEqual([])
		expect(result.total).toBe(0)
	})

	it('should list all users', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)
		await repository.create({ email: 'jane@example.com', password: 'hashed-password', name: 'Jane Doe' })

		const result = await repository.findAll()

		expect(result.data).toHaveLength(2)
		expect(result.total).toBe(2)
	})

	it('should paginate users correctly', async () => {
		const repository = new InMemoryUserRepository()

		for (let i = 1; i <= 5; i++) {
			await repository.create({ email: `user${i}@example.com`, password: 'hashed-password', name: `User ${i}` })
		}

		const page1 = await repository.findAll({ page: 1, limit: 2 })
		expect(page1.data).toHaveLength(2)
		expect(page1.total).toBe(5)
		expect(page1.page).toBe(1)
		expect(page1.limit).toBe(2)

		const page2 = await repository.findAll({ page: 2, limit: 2 })
		expect(page2.data).toHaveLength(2)

		const page3 = await repository.findAll({ page: 3, limit: 2 })
		expect(page3.data).toHaveLength(1)
	})

	it('should return null when findById finds no match', async () => {
		const repository = new InMemoryUserRepository()

		const result = await repository.findById(randomUUID())

		expect(result).toBeNull()
	})

	it('should find a user by id', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const { data } = await repository.findAll()
		const id = data[0].id

		const result = await repository.findById(id)

		expect(result).not.toBeNull()
		expect(result?.id).toBe(id)
		expect(result?.email).toBe(BASE_USER.email)
		expect(result?.name).toBe(BASE_USER.name)
	})

	it('should return null when findByEmail finds no match', async () => {
		const repository = new InMemoryUserRepository()

		const result = await repository.findByEmail('nonexistent@example.com')

		expect(result).toBeNull()
	})

	it('should find a user by email', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const result = await repository.findByEmail(BASE_USER.email)

		expect(result).not.toBeNull()
		expect(result?.email).toBe(BASE_USER.email)
	})

	it('should return null when findByName finds no match', async () => {
		const repository = new InMemoryUserRepository()

		const result = await repository.findByName('Unknown Name')

		expect(result).toBeNull()
	})

	it('should find a user by name', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const result = await repository.findByName(BASE_USER.name)

		expect(result).not.toBeNull()
		expect(result?.name).toBe(BASE_USER.name)
	})

	it('should save an updated user', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const { data } = await repository.findAll()
		const id = data[0].id

		const updated = new User({
			id,
			email: 'updated@example.com',
			password: 'new-hashed-password',
			name: 'Updated Name',
		})

		await repository.save(updated)

		const result = await repository.findById(id)
		expect(result?.email).toBe('updated@example.com')
		expect(result?.name).toBe('Updated Name')
	})

	it('should throw when saving a non-existent user', async () => {
		const repository = new InMemoryUserRepository()

		const user = new User({ id: randomUUID(), ...BASE_USER })

		await expect(repository.save(user)).rejects.toThrow()
	})

	it('should create a user', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const result = await repository.findAll()
		expect(result.data).toHaveLength(1)
		expect(result.total).toBe(1)
		expect(result.data[0].email).toBe(BASE_USER.email)
	})

	it('should delete a user', async () => {
		const repository = new InMemoryUserRepository()

		await repository.create(BASE_USER)

		const { data } = await repository.findAll()
		const id = data[0].id

		await repository.delete(id)

		const resultAfterDelete = await repository.findAll()
		expect(resultAfterDelete.data).toHaveLength(0)
		expect(resultAfterDelete.total).toBe(0)

		const deleted = await repository.findById(id)
		expect(deleted).toBeNull()
	})

	it('should throw when deleting a non-existent user', async () => {
		const repository = new InMemoryUserRepository()

		await expect(repository.delete('non-existent-id')).rejects.toThrow('User not found with id: non-existent-id')
	})
})
