import { httpRouter } from 'convex/server'
import { internal } from './_generated/api'
import { httpAction } from './_generated/server'
import { auth } from './auth'

const http = httpRouter()

auth.addHttpRoutes(http)

// Signed requests older than this are rejected (seconds).
const MAX_AGE_S = 60 * 60

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  )
  return Array.from(new Uint8Array(signature), (b) =>
    b.toString(16).padStart(2, '0')
  ).join('')
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

type CioEvent = {
  object_type?: string
  metric?: string
  timestamp?: number
  data?: {
    email_address?: string
    identifiers?: { email?: string; cio_id?: string }
  }
}

/**
 * Customer.io reporting webhook. Enable "customer subscribed",
 * "customer unsubscribed" and "email unsubscribed" events.
 * Signature: hex HMAC-SHA256 of `v0:<X-CIO-Timestamp>:<raw body>`.
 */
http.route({
  path: '/cio/webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.CIO_WEBHOOK_SIGNING_KEY
    if (!secret) return new Response('Not configured', { status: 500 })

    const timestamp = request.headers.get('x-cio-timestamp')
    const signature = request.headers.get('x-cio-signature')
    const body = await request.text()
    if (!timestamp || !signature) {
      return new Response('Missing signature', { status: 401 })
    }
    const age = Math.abs(Date.now() / 1000 - Number(timestamp))
    if (!Number.isFinite(age) || age > MAX_AGE_S) {
      return new Response('Stale request', { status: 401 })
    }
    const expected = await hmacSha256Hex(secret, `v0:${timestamp}:${body}`)
    if (!timingSafeEqual(expected, signature.toLowerCase())) {
      return new Response('Bad signature', { status: 401 })
    }

    let event: CioEvent
    try {
      event = JSON.parse(body)
    } catch {
      return new Response('Bad JSON', { status: 400 })
    }

    const subscribed =
      event.metric === 'subscribed'
        ? true
        : event.metric === 'unsubscribed'
          ? false
          : null
    if (
      subscribed === null ||
      (event.object_type !== 'customer' && event.object_type !== 'email')
    ) {
      return new Response(null, { status: 204 })
    }

    const email = event.data?.identifiers?.email ?? event.data?.email_address
    const cioId = event.data?.identifiers?.cio_id
    await ctx.runMutation(internal.members.setSubscribedFromCio, {
      email,
      cioId,
      subscribed,
      timestamp: (event.timestamp ?? Number(timestamp)) * 1000,
    })
    return new Response(null, { status: 204 })
  }),
})

export default http
