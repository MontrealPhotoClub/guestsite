import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import Success from './Success'
import toast, { Toaster } from 'react-hot-toast'
const notify = () => toast(<Success />, {})

import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function SignupCard() {
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
      // Token is set, can submit here
      console.log(`User Email: ${email}`)
      console.log(`hCaptcha Token: ${token}`)
    }
  }, [token, email])

  // submit form

  const onSubmit = async (data) => {
    captchaRef.current.execute()

    const res = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  return (
    <div className="grid items-center justify-center grid-flow-row gap-8 p-6 rounded-lg md:justify-between bg-brand-700 md:p-8 lg:p-12 md:grid-flow-col">
      <div>
        <h2 className="text-4xl font-extrabold tracking-tight text-center text-white sm:text-left">
          Make sure you don't miss out our future events.
        </h2>
        <p className="max-w-3xl mt-3 text-2xl leading-6 text-center sm:text-left text-brand-200">
          Join now for free
        </p>
      </div>
      <div className="mt-2">
        <form className="sm:flex" onSubmit={handleSubmit(onSubmit)}>
          <label for="email" className="sr-only">
            your@email.com
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            className="w-full px-5 py-3 placeholder-gray-500 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-700 focus:ring-white"
            placeholder="Enter your email"
            aria-describedby="email-description"
            ref={register({ required: true, maxLength: 80 })}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <button
            onClick={notify}
            type="submit"
            className="flex items-center justify-center w-full px-5 py-3 mt-3 text-base font-medium text-white border border-transparent rounded-md shadow bg-brand-500 hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
          >
            Join now
          </button>
          <HCaptcha
            // This is testing sitekey, will autopass
            // Make sure to replace
            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
            onVerify={setToken}
            onError={onError}
            onExpire={onExpire}
            ref={captchaRef}
          />
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
        <p className="mt-3 text-sm text-brand-200">
          Your personal information is never shared with anyone.
        </p>
      </div>
    </div>
  )
}
