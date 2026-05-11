import { randomUUID } from 'node:crypto'
import { User } from '@/domain/entities/user/user.js'
import { ResourceNotFoundError } from '@/domain/errors/resource-not-found-error.js'
import type { PaginatedResult, PaginationInput } from '../../pagination.js'
import type { CreateUserInput } from '../dtos/create-user-input-dto.js'
import type { UserRepository } from '../user-repository.js'

export class InMemoryUserRepository implements UserRepository {
	private users: User[] = []

	async findAll(pagination?: PaginationInput): Promise<PaginatedResult<User>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const start = (page - 1) * limit

		return {
			data: this.users.slice(start, start + limit),
			total: this.users.length,
			page,
			limit,
		}
	}
	async findById(id: string): Promise<User | null> {
		return this.users.find((u) => u.id === id) ?? null
	}
	async findByEmail(email: string): Promise<User | null> {
		return this.users.find((u) => u.email === email) ?? null
	}
	async findByName(name: string): Promise<User | null> {
		return this.users.find((u) => u.name === name) ?? null
	}
	async save(user: User): Promise<void> {
		const index = this.users.findIndex((u) => u.id === user.id)
		if (index === -1) {
			throw new ResourceNotFoundError(`User not found with id: ${user.id}`)
		}

		this.users[index] = user
	}
	async create(data: CreateUserInput): Promise<void> {
		const user = new User({
			id: randomUUID().toString(),
			...data,
		})
		this.users.push(user)
	}
	async delete(id: string): Promise<void> {
		const index = this.users.findIndex((u) => u.id === id)
		if (index === -1) {
			throw new ResourceNotFoundError(`User not found with id: ${id}`)
		}
		this.users.splice(index, 1)
	}
}
