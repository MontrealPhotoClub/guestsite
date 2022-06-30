import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { TranslateIcon } from '@heroicons/react/solid'
import Logo from '../elements/logos/Logo'
import LogoMobile from '../elements/logos/LogoMobile'

export default function Header({
  menuAbout,
  menuPast,
  menuContact,
  menuLogin,
}) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 mx-auto max-w-6xl bg-white bg-opacity-90 pt-4">
      <div className="flex items-center justify-between border-b-2 border-gray-100 py-6 text-xl font-semibold">
        <div>
          <NextLink href="/">
            <div className="cursor-pointer">
              <Logo />
            </div>
          </NextLink>
          <NextLink href="/">
            <div className="cursor-pointer">
              <LogoMobile />
            </div>
          </NextLink>
        </div>
        <div className="grid grid-flow-col items-center gap-4 text-sm font-medium outline-none focus:outline-none md:gap-8 md:text-base">
          <NextLink href="/about">
            <span className="cursor-pointer hover:text-brand-600">
              {menuAbout}
            </span>
          </NextLink>
          <NextLink href="/past">
            <span className="cursor-pointer hover:text-brand-600">
              {menuPast}
            </span>
          </NextLink>
          <NextLink href="/contact">
            <span className="cursor-pointer hover:text-brand-600">
              {menuContact}
            </span>
          </NextLink>
          <div className="grid grid-flow-col items-center gap-2">
            <a href={menuLogin}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer hover:text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </a>
            <NextLink href="/" locale={router.locale === 'en' ? 'fr' : 'en'}>
              <TranslateIcon className="h-6 w-6 cursor-pointer hover:text-brand-600" />
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  )
}
