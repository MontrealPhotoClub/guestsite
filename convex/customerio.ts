import { v } from 'convex/values'
import { internal } from './_generated/api'
import type { Doc } from './_generated/dataModel'
import { internalAction } from './_generated/server'

// Customer.io stays the email sender. Convex is the source of truth for
// members and pushes every change to Customer.io.

type Language = Doc<'members'>['language']

const MAX_ATTEMPTS = 5

function trackUrl(): string {
  return process.env.CIO_TRACK_URL ?? 'https://track.customer.io'
}

function appUrl(): string {
  return process.env.CIO_APP_URL ?? 'https://api.customer.io'
}

/** Track API auth: Basic base64(site_id:api_key). */
function trackAuth(): string | null {
  const siteId = process.env.CIO_SITE_ID
  const apiKey = process.env.CIO_TRACK_API_KEY
  if (!siteId || !apiKey) return null
  return `Basic ${btoa(`${siteId}:${apiKey}`)}`
}

/**
 * Sends the login code with a Customer.io transactional message.
 * The template reads `{{trigger.code}}` and `{{trigger.language}}`.
 * No `identifiers`: an unverified address must not create a person in
 * Customer.io. The member reaches Customer.io after the code is verified.
 */
export async function sendLoginCode(args: {
  email: string
  code: string
  language: Language
}): Promise<void> {
  const apiKey = process.env.CIO_APP_API_KEY
  const messageId = process.env.CIO_LOGIN_MESSAGE_ID
  if (!apiKey || !messageId) {
    // Local development only. Never set LOG_LOGIN_CODES in production.
    if (process.env.LOG_LOGIN_CODES === 'true') {
      console.log(`Login code for ${args.email}: ${args.code}`)
      return
    }
    throw new Error('Customer.io transactional email is not configured')
  }

  const response = await fetch(`${appUrl()}/v1/send/email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactional_message_id: messageId,
      to: args.email,
      language: args.language,
      message_data: { code: args.code, language: args.language },
      // Unsubscribed members still need a code to log in and resubscribe.
      send_to_unsubscribed: true,
      // Codes have no reason to stay in Customer.io's delivery history.
      disable_message_retention: true,
    }),
  })
  if (!response.ok) {
    throw new Error(
      `Customer.io send failed: ${response.status} ${await response.text()}`
    )
  }
}

/** Retries 429 and 5xx responses with backoff; throws on other errors. */
async function handleResponse(
  response: Response,
  retry: () => Promise<unknown>,
  attempt: number,
  label: string
): Promise<boolean> {
  if (response.ok) return true
  const body = await response.text()
  const retryable = response.status === 429 || response.status >= 500
  if (retryable && attempt < MAX_ATTEMPTS) {
    console.warn(`${label}: ${response.status}, retry ${attempt + 1}`)
    await retry()
    return false
  }
  throw new Error(`${label} failed: ${response.status} ${body}`)
}

/** New member: submit the legacy signup form so existing campaigns fire. */
export const submitSignupForm = internalAction({
  args: { memberId: v.id('members'), attempt: v.optional(v.number()) },
  handler: async (ctx, { memberId, attempt = 1 }) => {
    const auth = trackAuth()
    if (!auth) {
      console.warn('Customer.io Track API is not configured; skipping signup')
      return
    }
    const member = await ctx.runQuery(internal.members.get, { memberId })
    if (!member) return

    const formId =
      member.language === 'fr' ? 'next-signup-fr' : 'next-signup-en'
    const response = await fetch(
      `${trackUrl()}/api/v1/forms/${formId}/submit`,
      {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { email: member.email, language: member.language },
        }),
      }
    )
    const ok = await handleResponse(
      response,
      () =>
        ctx.scheduler.runAfter(
          2 ** attempt * 1000,
          internal.customerio.submitSignupForm,
          { memberId, attempt: attempt + 1 }
        ),
      attempt,
      'Customer.io form submit'
    )
    if (ok) await ctx.runMutation(internal.members.markSynced, { memberId })
  },
})

/** Profile change: update the person's attributes in Customer.io. */
export const identify = internalAction({
  args: { memberId: v.id('members'), attempt: v.optional(v.number()) },
  handler: async (ctx, { memberId, attempt = 1 }) => {
    const auth = trackAuth()
    if (!auth) {
      console.warn('Customer.io Track API is not configured; skipping identify')
      return
    }
    const member = await ctx.runQuery(internal.members.get, { memberId })
    if (!member) return

    const identifier = member.cioId ? `cio_${member.cioId}` : member.email
    const response = await fetch(
      `${trackUrl()}/api/v1/customers/${encodeURIComponent(identifier)}`,
      {
        method: 'PUT',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        // Attribute names match the legacy profile app.
        body: JSON.stringify({
          firstName: member.firstName ?? '',
          lastName: member.lastName ?? '',
          website: member.website ?? '',
          instagram: member.instagram ?? '',
          language: member.language,
          unsubscribed: !member.subscribed,
        }),
      }
    )
    const ok = await handleResponse(
      response,
      () =>
        ctx.scheduler.runAfter(
          2 ** attempt * 1000,
          internal.customerio.identify,
          {
            memberId,
            attempt: attempt + 1,
          }
        ),
      attempt,
      'Customer.io identify'
    )
    if (ok) await ctx.runMutation(internal.members.markSynced, { memberId })
  },
})
