import { LoginCode, type LoginCodeProps } from './_shared/LoginCode'

type Props = Partial<Omit<LoginCodeProps, 'locale'>>

// `email export` renders without props, so the default is the Liquid tag
// that Customer.io fills in. See scripts/build-login-email.mjs.
export default function LoginCodeFr({ code = '{{trigger.code}}' }: Props) {
  return <LoginCode locale="fr" code={code} />
}

LoginCodeFr.PreviewProps = { code: '482913' } satisfies Props
