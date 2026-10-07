import { Email } from '@convex-dev/auth/providers/Email'
import { convexAuth } from '@convex-dev/auth/server'
import { HOUR, MINUTE, RateLimiter } from '@convex-dev/rate-limiter'
import { ConvexError } from 'convex/values'
import { components } from './_generated/api'
import type { ActionCtx } from './_generated/server'
import { sendLoginCode } from './customerio'

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // 3 codes per address every 15 minutes.
  loginCodePerEmail: {
    kind: 'token bucket',
    rate: 3,
    period: 15 * MINUTE,
    capacity: 3,
  },
  // Caps the total email volume if someone scripts the form.
  loginCodeGlobal: {
    kind: 'token bucket',
    rate: 100,
    period: HOUR,
    capacity: 30,
  },
})

/** Uniform 6-digit code from a CSPRNG (rejection sampling, no modulo bias). */
function generateCode(): string {
  const range = 2 ** 32
  const limit = range - (range % 1_000_000)
  const buffer = new Uint32Array(1)
  do {
    crypto.getRandomValues(buffer)
  } while (buffer[0] >= limit)
  return (buffer[0] % 1_000_000).toString().padStart(6, '0')
}

const LoginCode = Email({
  id: 'login-code',
  maxAge: 15 * 60,
  generateVerificationToken: async () => generateCode(),
  // Convex Auth passes the action context as a second argument.
  async sendVerificationRequest(
    { identifier: email, token, url },
    ctx?: ActionCtx
  ) {
    if (!ctx) throw new Error('Missing action context')

    const key = email.trim().toLowerCase()
    const perEmail = await rateLimiter.limit(ctx, 'loginCodePerEmail', { key })
    if (!perEmail.ok) {
      throw new ConvexError({
        kind: 'RateLimited',
        retryAfter: perEmail.retryAfter,
      })
    }
    const global = await rateLimiter.limit(ctx, 'loginCodeGlobal')
    if (!global.ok) {
      throw new ConvexError({
        kind: 'RateLimited',
        retryAfter: global.retryAfter,
      })
    }

    // The client passes `redirectTo` = the profile page of its locale.
    const language = new URL(url).pathname.startsWith('/en') ? 'en' : 'fr'
    await sendLoginCode({ email, code: token, language })
  },
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [LoginCode],
})
