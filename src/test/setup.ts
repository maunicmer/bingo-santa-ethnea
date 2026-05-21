import '@testing-library/jest-dom'

window.AudioContext = vi.fn().mockImplementation(() => ({
  resume: vi.fn(),
  close: vi.fn(),
  createOscillator: vi.fn(),
  createGain: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
