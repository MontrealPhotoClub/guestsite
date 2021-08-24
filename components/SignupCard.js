import React from 'react'
import { useForm } from 'react-hook-form'

import Success from './Success'
import toast, { Toaster } from 'react-hot-toast'
const notify = () => toast(<Success />, {})

export default function SignupCard({
  signupHeadline,
  signupSubline,
  signupPlaceholder,
  signupCta,
  signupPrivacy,
}) {
  const { register, handleSubmit, errors } = useForm()

  const onSubmit = async (data) => {
    const res = await fetch('/api/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  }

  return (
    <div className="py-12 rounded-lg bg-brand-700 md:px-12 lg:px-16 xl:flex xl:items-center">
      <div className="xl:w-0 xl:flex-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {signupHeadline}
        </h2>
        <p className="max-w-3xl mt-3 text-lg leading-6 text-brand-200">
          {signupSubline}
        </p>
      </div>
      <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
        <form className="sm:flex" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="sr-only">
            your@email.com
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full px-5 py-3 placeholder-gray-500 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-700 focus:ring-white"
            placeholder={signupPlaceholder}
            aria-describedby="email-description"
            ref={register({ required: true, maxLength: 80 })}
          />
          <button
            onClick={notify}
            type="submit"
            className="flex items-center justify-center w-full px-5 py-3 mt-3 text-base font-medium text-white border border-transparent rounded-md shadow bg-brand-500 hover:bg-brand-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
          >
            {signupCta}
          </button>
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
        <p className="mt-3 text-sm text-brand-200">{signupPrivacy}</p>
      </div>
    </div>
  )
}
