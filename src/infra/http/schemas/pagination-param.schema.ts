import z from 'zod'

export const paginationParamSchema = z.object({
	page: z.number(),
	limit: z.number(),
})

export type paginationParamRequest = z.infer<typeof paginationParamSchema>
