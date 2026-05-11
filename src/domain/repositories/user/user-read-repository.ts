import type { User } from '@/domain/entities/user/user.js'
import type { PaginatedResult, PaginationInput } from '../pagination.js'

export interface UserReadRepository {
	findAll(pagination?: PaginationInput): Promise<PaginatedResult<User>>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	findByName(name: string): Promise<User | null>
}
