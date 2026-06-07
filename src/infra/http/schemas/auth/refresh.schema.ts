import z from 'zod'

export const refreshSchema = z.object({
	token: z.string(),
})

export type RefreshRequest = z.infer<typeof refreshSchema>
