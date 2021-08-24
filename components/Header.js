import NextLink from 'next/link'
import { useRouter } from 'next/router'

import Logo from '../elements/logos/Logo'
import LogoMobile from '../elements/logos/LogoMobile'
import { TranslateIcon } from '@heroicons/react/solid'

export default function Header({ menuAbout, menuPast, menuContact }) {

  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 max-w-6xl pt-4 mx-auto bg-white bg-opacity-90">
      <div className="flex items-center justify-between py-6 text-xl font-semibold border-b-2 border-gray-100">
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
        <div className="grid grid-flow-col gap-8 text-base font-medium outline-none focus:outline-none">
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
          <NextLink
            href='/'
            locale={router.locale === 'en' ? 'fr' : 'en'}
          >
            <TranslateIcon className="w-5 h-5 cursor-pointer"/>
          </NextLink>
        </div>
      </div>
    </div>
  )
}
