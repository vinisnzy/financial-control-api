import z from 'zod'

export const idParamSchema = z.object({
	id: z.uuid(),
})

export type idParamRequest = z.infer<typeof idParamSchema>
