import { ConvexAuthProvider, useAuthActions } from '@convex-dev/auth/react'
import {
  ConvexReactClient,
  useConvexAuth,
  useMutation,
  useQuery,
} from 'convex/react'
import { ConvexError } from 'convex/values'
import { useEffect, useState, type SubmitEvent } from 'react'
import { api } from '../../../convex/_generated/api'
import type { Dict, Locale } from '../../i18n'

type Strings = Dict['profile']

interface Props {
  locale: Locale
  strings: Strings
  /** Profile page path for this locale. Also tells Convex the email language. */
  redirectTo: string
}

const PROVIDER = 'login-code'
const convexUrl = import.meta.env.PUBLIC_CONVEX_URL
const client = convexUrl ? new ConvexReactClient(convexUrl) : null

function format(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}

function errorData(error: unknown): Record<string, unknown> | null {
  return error instanceof ConvexError && typeof error.data === 'object'
    ? (error.data as Record<string, unknown>)
    : null
}

export default function ProfileApp(props: Props) {
  if (!client) {
    return <p className="profile-error">{props.strings.errors.config}</p>
  }
  return (
    // Codes are typed in, not clicked, so the provider must not read ?code=.
    <ConvexAuthProvider client={client} shouldHandleCode={false}>
      <Profile {...props} />
    </ConvexAuthProvider>
  )
}

function Profile(props: Props) {
  const { isLoading, isAuthenticated } = useConvexAuth()
  if (isLoading) return <p className="profile-status">{props.strings.loading}</p>
  return isAuthenticated ? <MemberForm {...props} /> : <SignIn {...props} />
}

function SignIn({ strings, redirectTo }: Props) {
  const { signIn } = useAuthActions()
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onEmailSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    // Honeypot: people never see this field, bots fill it in.
    if (form.get('fax')) {
      setStep('code')
      return
    }
    const normalized = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError(strings.errors.invalidEmail)
      return
    }
    setEmail(normalized)
    await sendCodeFor(normalized)
  }

  async function sendCodeFor(address: string) {
    setPending(true)
    setError(null)
    try {
      await signIn(PROVIDER, { email: address, redirectTo })
      setStep('code')
      setCode('')
    } catch (err) {
      setError(
        errorData(err)?.kind === 'RateLimited'
          ? strings.errors.tooManyRequests
          : strings.errors.generic
      )
    } finally {
      setPending(false)
    }
  }

  async function onCodeSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await signIn(PROVIDER, { email, code: code.trim() })
    } catch {
      setError(strings.errors.invalidCode)
    } finally {
      setPending(false)
    }
  }

  if (step === 'code') {
    return (
      <form className="profile-form" data-step="code" onSubmit={onCodeSubmit}>
        <p>{format(strings.codeSentTo, { email })}</p>
        <div className="profile-field">
          <label htmlFor="profile-code">{strings.codeLabel}</label>
          <input
            id="profile-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        {error && (
          <p className="profile-error" role="alert">
            {error}
          </p>
        )}
        <div className="profile-actions">
          <button type="submit" disabled={pending}>
            {strings.verify}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void sendCodeFor(email)}
          >
            {strings.resend}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('email')
              setError(null)
            }}
          >
            {strings.useAnotherEmail}
          </button>
        </div>
      </form>
    )
  }

  return (
    <form className="profile-form" data-step="email" onSubmit={onEmailSubmit}>
      <p>{strings.intro}</p>
      <div className="profile-field">
        <label htmlFor="profile-email">{strings.emailLabel}</label>
        <input
          id="profile-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={strings.emailPlaceholder}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="profile-honeypot" aria-hidden="true">
        <label htmlFor="profile-fax">Fax</label>
        <input id="profile-fax" name="fax" tabIndex={-1} autoComplete="off" />
      </div>
      {error && (
        <p className="profile-error" role="alert">
          {error}
        </p>
      )}
      <div className="profile-actions">
        <button type="submit" disabled={pending}>
          {strings.sendCode}
        </button>
      </div>
    </form>
  )
}

type Fields = {
  firstName: string
  lastName: string
  website: string
  instagram: string
  language: Locale
  subscribed: boolean
}

function MemberForm({ locale, strings }: Props) {
  const me = useQuery(api.members.me)
  const ensure = useMutation(api.members.ensure)
  const update = useMutation(api.members.update)
  const { signOut } = useAuthActions()

  const [fields, setFields] = useState<Fields | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  )

  // First login: create the member, or link the imported one.
  useEffect(() => {
    if (me === null) void ensure({ language: locale })
  }, [me, ensure, locale])

  useEffect(() => {
    if (me && fields === null) {
      setFields({
        firstName: me.firstName,
        lastName: me.lastName,
        website: me.website,
        instagram: me.instagram,
        language: me.language,
        subscribed: me.subscribed,
      })
    }
  }, [me, fields])

  if (!me || !fields) {
    return <p className="profile-status">{strings.loading}</p>
  }

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => (current ? { ...current, [key]: value } : current))
    setStatus('idle')
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!fields) return
    setStatus('saving')
    setFieldErrors({})
    try {
      await update(fields)
      setStatus('saved')
    } catch (err) {
      const data = errorData(err)
      if (typeof data?.field === 'string') {
        const message =
          data.kind === 'tooLong'
            ? strings.errors.tooLong
            : data.field === 'website'
              ? strings.errors.invalidWebsite
              : data.field === 'instagram'
                ? strings.errors.invalidInstagram
                : strings.errors.generic
        setFieldErrors({ [data.field]: message })
      }
      setStatus('error')
    }
  }

  const memberSince = new Intl.DateTimeFormat(`${locale}-CA`, {
    dateStyle: 'long',
  }).format(new Date(me.createdAt))

  const textField = (
    key: 'firstName' | 'lastName' | 'website' | 'instagram',
    props: { autoComplete?: string; placeholder?: string; type?: string } = {}
  ) => (
    <div className="profile-field">
      <label htmlFor={`profile-${key}`}>{strings[key]}</label>
      <input
        id={`profile-${key}`}
        name={key}
        type={props.type ?? 'text'}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        value={fields[key]}
        aria-invalid={fieldErrors[key] ? true : undefined}
        aria-describedby={fieldErrors[key] ? `profile-${key}-error` : undefined}
        onChange={(e) => set(key, e.target.value)}
      />
      {fieldErrors[key] && (
        <p id={`profile-${key}-error`} className="profile-error">
          {fieldErrors[key]}
        </p>
      )}
    </div>
  )

  return (
    <form className="profile-form" data-step="profile" onSubmit={onSubmit}>
      <p className="profile-email">{me.email}</p>
      <p className="profile-since">
        {format(strings.memberSince, { date: memberSince })}
      </p>

      {textField('firstName', { autoComplete: 'given-name' })}
      {textField('lastName', { autoComplete: 'family-name' })}
      {textField('website', {
        autoComplete: 'url',
        placeholder: strings.websitePlaceholder,
        type: 'url',
      })}
      {textField('instagram', {
        autoComplete: 'off',
        placeholder: strings.instagramPlaceholder,
      })}

      <fieldset className="profile-field">
        <legend>{strings.language}</legend>
        {(['fr', 'en'] as const).map((value) => (
          <label key={value}>
            <input
              type="radio"
              name="language"
              value={value}
              checked={fields.language === value}
              onChange={() => set('language', value)}
            />
            {value === 'fr' ? strings.languageFr : strings.languageEn}
          </label>
        ))}
      </fieldset>

      <div className="profile-field">
        <label>
          <input
            type="checkbox"
            name="subscribed"
            checked={fields.subscribed}
            onChange={(e) => set('subscribed', e.target.checked)}
          />
          {strings.subscribed}
        </label>
      </div>

      <div className="profile-actions">
        <button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? strings.saving : strings.save}
        </button>
        <button type="button" onClick={() => void signOut()}>
          {strings.signOut}
        </button>
      </div>
      <p className="profile-status" role="status">
        {status === 'saved' && strings.saved}
        {status === 'error' &&
          Object.keys(fieldErrors).length === 0 &&
          strings.errors.generic}
      </p>
    </form>
  )
}
