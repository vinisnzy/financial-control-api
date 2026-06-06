import type { User } from '@/domain/entities/user/user.js'
import type { CreateUserInput } from './dtos/create-user-input-dto.js'

export interface UserWriteRepository {
	save(user: User): Promise<void>
	create(data: CreateUserInput): Promise<User>
	delete(id: string): Promise<void>
}
