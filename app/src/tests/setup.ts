import { cleanup, configure } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import '@/i18n/i18n'
import { testUtils } from './testUtils'

configure({ asyncUtilTimeout: 3000 })
testUtils.installMatchMedia()
window.scrollTo = () => {}
HTMLDialogElement.prototype.showModal = function showModal (this: HTMLDialogElement) {
  this.open = true
}
HTMLDialogElement.prototype.close = function close (this: HTMLDialogElement) {
  this.open = false
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  testUtils.setViewportWidth(1280)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
