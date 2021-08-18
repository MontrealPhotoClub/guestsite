export default function SignupCard() {
  return (
    <div className="grid grid-flow-row px-2 gap-y-16">
      <h1 className="text-4xl font-bold sm:text-5xl">
        We're a friendly gathering of photographers and we're hosting regular
        events in Montréal.
      </h1>

      <div className="bg-indigo-700 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
        <div className="xl:w-0 xl:flex-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Make sure you don't miss out our future events.
          </h2>
          <p className="max-w-3xl mt-3 text-lg leading-6 text-indigo-200">
            Join now for free
          </p>
        </div>
        <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
          <form className="sm:flex">
            <label for="emailAddress" className="sr-only">
              your@email.com
            </label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              autocomplete="email"
              required
              className="w-full px-5 py-3 placeholder-gray-500 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="flex items-center justify-center w-full px-5 py-3 mt-3 text-base font-medium text-white bg-indigo-500 border border-transparent rounded-md shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
            >
              Join now
            </button>
          </form>
          <p className="mt-3 text-sm text-indigo-200">
            Your personal information is never shared with anyone.
          </p>
        </div>
      </div>
    </div>
  )
}
