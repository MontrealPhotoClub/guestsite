import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import toast, { Toaster } from 'react-hot-toast'
import Success from './Success'

import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function SignupCard({
  signupHeadline,
  signupSubline,
  signupPlaceholder,
  signupCta,
  signupPrivacy,
  signupLocale,
}) {
  const { register, handleSubmit, errors } = useForm()

  // hcaptcha
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState('')
  const captchaRef = useRef(null)

  const onExpire = () => {
    console.log('hCaptcha Token Expired')
  }

  const onError = (err) => {
    console.log(`hCaptcha Error: ${err}`)
  }

  useEffect(() => {
    if (token) {
      const data = { email: `${email}` }

      if (signupLocale === 'fr') {
        fetch('/api/formFr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      } else {
        fetch('/api/form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
      }

      toast(<Success />, {})
    }
  }, [token, email])

  const onSubmit = () => {
    captchaRef.current.execute()
  }

  return (
    <div className="grid grid-flow-row items-center justify-center gap-8 rounded-lg bg-brand-700 p-6 md:grid-flow-col md:justify-between md:p-8 lg:p-12">
      <div>
        <h2 className="text-center text-4xl font-extrabold tracking-tight text-white sm:text-left">
          {signupHeadline}
        </h2>
        <p className="mt-3 max-w-3xl text-center text-2xl leading-6 text-brand-200 sm:text-left">
          {signupSubline}
        </p>
      </div>
      <div className="mt-2">
        <form className="sm:flex" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="grid grid-flow-row sm:grid-flow-col">
              <label htmlFor="email" className="sr-only">
                your@email.com
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-700"
                placeholder={signupPlaceholder}
                aria-describedby={signupPlaceholder}
                ref={register({ required: true, maxLength: 80 })}
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
              />
              <button
                type="submit"
                className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-brand-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
              >
                {signupCta}
              </button>
            </div>
            <div className="mt-2">
              <HCaptcha
                // This is testing sitekey, will autopass
                // Make sure to replace
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={setToken}
                onError={onError}
                onExpire={onExpire}
                ref={captchaRef}
                size="invisible"
              />
            </div>
          </div>
          <Toaster
            toastOptions={{
              className: 'rounded-md bg-green-50 p-4',
              duration: 10000,
              style: {
                background: 'transparent',
                border: '0px solid black',
                boxShadow: 'none',
              },
            }}
          />
        </form>
        <p className="mt-3 text-center text-xs text-brand-200 md:text-sm">
          {signupPrivacy}
        </p>
      </div>
    </div>
  )
}
