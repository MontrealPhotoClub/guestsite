import type { Dict } from './index'

const en = {
  meta: {
    siteName: 'Montréal Photo Club',
    description:
      'A friendly gathering of photographers in Montréal from all horizons and skills.',
    dateLocale: 'en-CA',
  },
  nav: {
    label: 'Main navigation',
    skipToContent: 'Skip to content',
    home: 'Home',
    about: 'About',
    events: 'Events',
    contact: 'Contact',
    profile: 'My profile',
    switchLanguage: 'Français',
    switchLanguageLabel: 'Lire cette page en français',
  },
  home: {
    missionStatement:
      "We're a friendly gathering of photographers and we're hosting regular events in Montréal.",
    founderQuote:
      'After hosting multiple events with Unsplash and the Metro Photo Challenge, I decided to make this a more formal club. So that we can keep having fun, learning from each other, and meeting other fine folks.',
    founderName: 'Jp Valery',
    founderTitle: 'Founder',
    latestEvents: 'Past events',
    allEvents: 'All events',
  },
  join: {
    headline: "Make sure you don't miss our future events",
    subline: 'Join now for free',
    cta: 'Join now',
    privacy: 'Your personal information is never shared with anyone.',
  },
  events: {
    title: 'Past Events',
    excerpt: 'List of past events hosted by the Montréal Photo Club',
    by: 'by',
    backToEvents: 'All events',
  },
  stewards: {
    banner: 'The Montréal Photo Club is looking for new stewards.',
    bannerCta: 'Learn more',
  },
  profile: {
    title: 'My profile',
    intro:
      "Enter your email. We'll send you a code to join the club or open your profile.",
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    sendCode: 'Send me a code',
    codeSentTo: 'We sent a code to {email}. It expires in 15 minutes.',
    codeLabel: '6-digit code',
    verify: 'Verify',
    resend: 'Send a new code',
    useAnotherEmail: 'Use another email',
    loading: 'Loading…',
    memberSince: 'Member since {date}',
    firstName: 'First name',
    lastName: 'Last name',
    website: 'Website',
    websitePlaceholder: 'https://',
    instagram: 'Instagram',
    instagramPlaceholder: 'username',
    language: 'Email language',
    languageFr: 'Français',
    languageEn: 'English',
    subscribed: 'Receive event announcements by email',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Profile saved.',
    signOut: 'Sign out',
    errors: {
      config: 'Profiles are unavailable right now.',
      invalidEmail: 'Enter a valid email address.',
      invalidCode: 'This code is invalid or expired.',
      tooManyRequests: 'Too many requests. Try again in a few minutes.',
      invalidWebsite: 'Enter a valid web address (https://…).',
      invalidInstagram: 'Enter a valid Instagram username.',
      tooLong: 'This field is too long.',
      generic: 'Something went wrong. Try again.',
    },
  },
  footer: {
    contact: 'Write to us',
  },
  notFound: {
    title: 'Page not found',
    body: "This page doesn't exist or has moved.",
    back: 'Back to home',
  },
} satisfies Dict

export default en
