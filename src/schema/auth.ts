import z from 'zod'

export const signInBodySchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export const refreshTokenBodySchema = z.object({
  expiresInMins: z.number().optional().default(1440),
})

export type TSignInBody = z.infer<typeof signInBodySchema>
export type TRefreshTokenBody = z.infer<typeof refreshTokenBodySchema>
