import { User } from '@/domain/entities/user/user.js'
import type { User as UserPrisma } from '@/generated/prisma/client.js'

export function userPrismaToEntity(user: UserPrisma) {
	return new User({
		id: user.id,
		email: user.email,
		password: user.password,
		name: user.name,
		createdAt: user.createdAt,
	})
}
