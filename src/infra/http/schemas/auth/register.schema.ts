import z from 'zod'

export const registerSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	name: z.string(),
})

export type RegisterRequest = z.infer<typeof registerSchema>
