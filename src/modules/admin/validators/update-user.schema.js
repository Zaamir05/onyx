const { z } = require('zod')

const objectId = /^[a-f\d]{24}$/i

const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().regex(objectId, 'Invalid userId')
  }),
  body: z
    .object({
      fullName: z.string().trim().min(2).max(120).optional(),
      role: z.enum(['buyer', 'seller', 'admin']).optional(),
      isActive: z.boolean().optional(),
      onyxCredits: z.number().nonnegative().optional(),
      profile: z
        .object({
          avatarUrl: z.string().trim().max(1024).nullable().optional(),
          phone: z.string().trim().max(30).nullable().optional()
        })
        .strict()
        .optional()
    })
    .strict()
    .refine((body) =>
      body.fullName !== undefined ||
      body.role !== undefined ||
      body.isActive !== undefined ||
      body.onyxCredits !== undefined ||
      body.profile !== undefined,
    {
      message: 'At least one field must be provided'
    }),
  query: z.object({}).passthrough()
})

module.exports = { updateUserSchema }
