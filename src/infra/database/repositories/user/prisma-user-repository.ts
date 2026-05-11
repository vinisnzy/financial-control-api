import { httpErrors } from '@fastify/sensible'
import type { User } from '@/domain/entities/user/user.js'
import type { PaginatedResult, PaginationInput } from '@/domain/repositories/pagination.js'
import type { CreateUserInput } from '@/domain/repositories/user/dtos/create-user-input-dto.js'
import type { UserRepository } from '@/domain/repositories/user/user-repository.js'
import { Prisma } from '@/generated/prisma/client.js'
import { prisma } from '../../lib/prisma.js'
import { userPrismaToEntity } from '../../mapper/user-prisma-to-entity.js'

export class PrismaUserRepository implements UserRepository {
	async findAll(pagination?: PaginationInput): Promise<PaginatedResult<User>> {
		const page = pagination?.page ?? 1
		const limit = pagination?.limit ?? 20

		const skip = (page - 1) * limit

		const [users, total] = await prisma.$transaction([prisma.user.findMany({ skip, take: limit }), prisma.user.count()])

		return {
			data: users.map((u) => userPrismaToEntity(u)),
			total,
			page,
			limit,
		}
	}
	async findById(id: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { id },
		})
		if (!user) {
			return null
		}
		return userPrismaToEntity(user)
	}
	async findByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findUnique({
			where: { email },
		})
		if (!user) {
			return null
		}
		return userPrismaToEntity(user)
	}
	async findByName(name: string): Promise<User | null> {
		const user = await prisma.user.findFirst({
			where: { name },
		})
		if (!user) {
			return null
		}
		return userPrismaToEntity(user)
	}
	async save(user: User): Promise<void> {
		try {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					email: user.email,
					password: user.password,
					name: user.name,
				},
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw httpErrors.notFound(`User not found with id: ${user.id}`)
			}
		}
	}
	async create(data: CreateUserInput): Promise<void> {
		await prisma.user.create({ data: { ...data } })
	}
	async delete(id: string): Promise<void> {
		const result = await prisma.user.delete({ where: { id } })
		if (!result) {
			throw httpErrors.notFound(`User not found with id: ${id}`)
		}
	}
}
