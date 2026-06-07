import z from 'zod'

export const logoutSchema = z.object({
	token: z.string(),
})

export type LogoutRequest = z.infer<typeof logoutSchema>
