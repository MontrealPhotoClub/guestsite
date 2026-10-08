interface ImportMetaEnv {
  /** Convex deployment URL, e.g. https://<name>.convex.cloud */
  readonly PUBLIC_CONVEX_URL?: string
  /** Umami website id. Analytics stay off when unset. */
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
