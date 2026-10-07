import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'
import { internal } from './_generated/api'
import type { Doc, Id } from './_generated/dataModel'
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from './_generated/server'
import { language } from './schema'

const MAX_NAME = 80
const MAX_URL = 200

type FieldError = { field: string; kind: 'invalid' | 'tooLong' }

function fail(error: FieldError): never {
  throw new ConvexError(error)
}

function cleanText(value: string, field: string): string | undefined {
  const text = value.trim()
  if (!text) return undefined
  if (text.length > MAX_NAME) fail({ field, kind: 'tooLong' })
  return text
}

function cleanWebsite(value: string): string | undefined {
  let text = value.trim()
  if (!text) return undefined
  if (!/^https?:\/\//i.test(text)) text = `https://${text}`
  if (text.length > MAX_URL) fail({ field: 'website', kind: 'tooLong' })
  try {
    const parsed = new URL(text)
    if (!parsed.hostname.includes('.')) throw new Error('No TLD')
    return parsed.href
  } catch {
    fail({ field: 'website', kind: 'invalid' })
  }
}

function cleanInstagram(value: string): string | undefined {
  const handle = value
    .trim()
    .replace(/^@/, '')
    .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, '')
    .replace(/[/?#].*$/, '')
  if (!handle) return undefined
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) {
    fail({ field: 'instagram', kind: 'invalid' })
  }
  return handle
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function memberForUser(
  ctx: QueryCtx,
  userId: Id<'users'>
): Promise<Doc<'members'> | null> {
  return ctx.db
    .query('members')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .unique()
}

async function memberByEmail(
  ctx: QueryCtx,
  email: string
): Promise<Doc<'members'> | null> {
  return ctx.db
    .query('members')
    .withIndex('by_email', (q) => q.eq('email', normalizeEmail(email)))
    .first()
}

async function requireMember(ctx: MutationCtx): Promise<Doc<'members'>> {
  const userId = await getAuthUserId(ctx)
  if (!userId) throw new ConvexError({ kind: 'Unauthenticated' })
  const member = await memberForUser(ctx, userId)
  if (!member) throw new ConvexError({ kind: 'NoMember' })
  return member
}

/** The signed-in member, or null (signed out, or `ensure` not run yet). */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return null
    const member = await memberForUser(ctx, userId)
    if (!member) return null
    return {
      email: member.email,
      firstName: member.firstName ?? '',
      lastName: member.lastName ?? '',
      website: member.website ?? '',
      instagram: member.instagram ?? '',
      language: member.language,
      subscribed: member.subscribed,
      createdAt: member.createdAt,
    }
  },
})

/**
 * Runs after login. Links an imported member to the auth user, or creates
 * a new member (joining = subscribing) and tells Customer.io.
 */
export const ensure = mutation({
  args: { language },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new ConvexError({ kind: 'Unauthenticated' })

    const existing = await memberForUser(ctx, userId)
    if (existing) return existing._id

    const user = await ctx.db.get(userId)
    if (!user?.email) throw new ConvexError({ kind: 'NoEmail' })

    const imported = await memberByEmail(ctx, user.email)
    if (imported) {
      await ctx.db.patch(imported._id, { userId })
      return imported._id
    }

    const memberId = await ctx.db.insert('members', {
      userId,
      email: normalizeEmail(user.email),
      language: args.language,
      subscribed: true,
      subscribedChangedAt: Date.now(),
      createdAt: Date.now(),
    })
    await ctx.scheduler.runAfter(0, internal.customerio.submitSignupForm, {
      memberId,
    })
    return memberId
  },
})

export const update = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    website: v.string(),
    instagram: v.string(),
    language,
    subscribed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const member = await requireMember(ctx)
    await ctx.db.patch(member._id, {
      firstName: cleanText(args.firstName, 'firstName'),
      lastName: cleanText(args.lastName, 'lastName'),
      website: cleanWebsite(args.website),
      instagram: cleanInstagram(args.instagram),
      language: args.language,
      subscribed: args.subscribed,
      ...(args.subscribed !== member.subscribed && {
        subscribedChangedAt: Date.now(),
      }),
    })
    await ctx.scheduler.runAfter(0, internal.customerio.identify, {
      memberId: member._id,
    })
  },
})

export const get = internalQuery({
  args: { memberId: v.id('members') },
  handler: (ctx, { memberId }) => ctx.db.get(memberId),
})

export const markSynced = internalMutation({
  args: { memberId: v.id('members') },
  handler: (ctx, { memberId }) =>
    ctx.db.patch(memberId, { syncedAt: Date.now() }),
})

/** From the Customer.io reporting webhook. Never syncs back to Customer.io. */
export const setSubscribedFromCio = internalMutation({
  args: {
    email: v.optional(v.string()),
    cioId: v.optional(v.string()),
    subscribed: v.boolean(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    const byCioId = args.cioId
      ? await ctx.db
          .query('members')
          .withIndex('by_cioId', (q) => q.eq('cioId', args.cioId))
          .first()
      : null
    const member =
      byCioId ?? (args.email ? await memberByEmail(ctx, args.email) : null)
    if (!member) return 'unknown'
    if ((member.subscribedChangedAt ?? 0) >= args.timestamp) return 'stale'

    await ctx.db.patch(member._id, {
      subscribed: args.subscribed,
      subscribedChangedAt: args.timestamp,
      ...(!member.cioId && args.cioId && { cioId: args.cioId }),
    })
    return 'updated'
  },
})

/** Used by scripts/import-cio.ts. Idempotent by email. */
export const importBatch = internalMutation({
  args: {
    rows: v.array(
      v.object({
        email: v.string(),
        cioId: v.optional(v.string()),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        website: v.optional(v.string()),
        instagram: v.optional(v.string()),
        language: v.optional(v.string()),
        unsubscribed: v.optional(v.boolean()),
        createdAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { rows }) => {
    let inserted = 0
    let updated = 0
    let skipped = 0
    for (const row of rows) {
      const email = normalizeEmail(row.email)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        skipped++
        continue
      }
      const fields = {
        cioId: row.cioId || undefined,
        firstName: row.firstName?.trim() || undefined,
        lastName: row.lastName?.trim() || undefined,
        website: row.website?.trim() || undefined,
        instagram: row.instagram?.trim().replace(/^@/, '') || undefined,
        language: row.language === 'en' ? ('en' as const) : ('fr' as const),
        subscribed: row.unsubscribed !== true,
      }
      const existing = await memberByEmail(ctx, email)
      if (existing) {
        // Patch only the columns present in the CSV.
        await ctx.db.patch(
          existing._id,
          Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
          )
        )
        updated++
      } else {
        await ctx.db.insert('members', {
          ...fields,
          email,
          createdAt: row.createdAt ?? Date.now(),
        })
        inserted++
      }
    }
    return { inserted, updated, skipped }
  },
})
