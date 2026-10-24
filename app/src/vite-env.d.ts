/// <reference types="vite/client" />

interface ImportMetaEnv {
  // kit:if mocks
  readonly VITE_USE_MOCKS: 'true' | 'false'
  // kit:end
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
