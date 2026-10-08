import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const language = v.union(v.literal('fr'), v.literal('en'))

export default defineSchema({
  ...authTables,

  members: defineTable({
    // Unset for members imported from Customer.io who never logged in.
    userId: v.optional(v.id('users')),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    website: v.optional(v.string()),
    instagram: v.optional(v.string()),
    language,
    subscribed: v.boolean(),
    // Last subscription change (ms). Older Customer.io webhooks are ignored.
    subscribedChangedAt: v.optional(v.number()),
    // Customer.io canonical id, without the `cio_` prefix.
    cioId: v.optional(v.string()),
    createdAt: v.number(),
    // Last successful push to Customer.io (ms).
    syncedAt: v.optional(v.number()),
  })
    .index('by_userId', ['userId'])
    .index('by_email', ['email'])
    .index('by_cioId', ['cioId']),
})
