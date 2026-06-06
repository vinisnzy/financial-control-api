import type { UserResponseDTO } from '@/application/dtos/user/user-response.dto.js'
import { EmailAlreadyInUseError } from '@/domain/errors/email-already-in-use-error.js'
import type { UserRepository } from '@/domain/repositories/user/user-repository.js'
import type { HashService } from '@/domain/services/hash-service.js'

interface RegisterInput {
	email: string
	password: string
	name: string
}

export class RegisterUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hashService: HashService,
	) {}
	async execute(data: RegisterInput): Promise<UserResponseDTO> {
		if (await this.userRepository.findByEmail(data.email)) throw new EmailAlreadyInUseError()
		const hashed = await this.hashService.hash(data.password)

		const user = await this.userRepository.create({ ...data, password: hashed })
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
		}
	}
}
