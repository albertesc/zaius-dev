export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiError = Error & {
  name: 'ApiError'
  status: number
  code: string | null
}

export type RequestFailure = 'network' | 'generic'

export type ApiSessionEnd = 'expired'

export type ApiSession = {
  getToken: () => string | null
  onEnd: (reason: ApiSessionEnd) => void
}

export type UploadOptions = {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}
