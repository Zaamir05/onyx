const { z } = require('zod')

const listUsersSchema = z.object({
  params: z.object({}).passthrough(),
  body: z.object({}).passthrough(),
  query: z
    .object({
      page: z.coerce.number().int().min(1).max(1000).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      search: z.string().trim().max(120).optional(),
      role: z.enum(['buyer', 'seller', 'admin']).optional(),
      isActive: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
      sortBy: z.enum(['createdAt', 'lastLoginAt', 'onyxCredits', 'fullName']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc')
    })
    .strict()
})

module.exports = { listUsersSchema }
