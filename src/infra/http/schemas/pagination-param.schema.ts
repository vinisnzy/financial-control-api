import z from 'zod'

export const paginationParamSchema = z.object({
	page: z.coerce.number().int().positive(),
	limit: z.coerce.number().int().positive(),
})

export type paginationParamRequest = z.infer<typeof paginationParamSchema>
