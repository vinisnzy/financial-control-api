import { PrismaPg } from '@prisma/adapter-pg'
import { afterAll, afterEach } from 'vitest'
import { PrismaClient } from '../src/generated/prisma/client.js'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' })

export const prisma = new PrismaClient({ adapter })

afterEach(async () => {
	await prisma.$executeRawUnsafe(
		'TRUNCATE TABLE "incomes", "fixed_expenses", "variable_expenses" RESTART IDENTITY CASCADE',
	)
})

afterAll(async () => {
	await prisma.$disconnect()
})
