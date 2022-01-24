import Instagram from '../elements/icons/Instagram'
import Twitter from '../elements/icons/Twitter'

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href="https://instgram.com/montrealphotoclub"
            className="h-6 w-6 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Instagram</span>
            <Instagram />
          </a>

          <a
            href="https://twitter.com/jpvalery"
            className="h-6 w-6 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Twitter</span>
            <Twitter />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm text-gray-500">
            &copy; 2018-2022 Montréal Photo Club
          </p>
        </div>
      </div>
    </footer>
  )
}
