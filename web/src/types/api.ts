export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiError = Error & {
  name: 'ApiError'
  status: number
  code: string | null
}

export type RequestFailure = 'network' | 'generic'

// kit:if privateArea
export type ApiSessionEnd = 'expired'

export type ApiSession = {
  getToken: () => string | null
  onEnd: (reason: ApiSessionEnd) => void
}

// kit:end
export type UploadOptions = {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}
