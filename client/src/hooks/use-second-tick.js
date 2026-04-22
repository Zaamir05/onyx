import { useSyncExternalStore } from 'react'

const listeners = new Set()
let nowMs = Date.now()
let intervalId = null

function ensureClockStarted () {
  if (intervalId !== null) return
  intervalId = setInterval(() => {
    nowMs = Date.now()
    listeners.forEach((notify) => notify())
  }, 1000)
}

function subscribe (notify) {
  ensureClockStarted()
  listeners.add(notify)
  return () => listeners.delete(notify)
}

function getSnapshot () {
  return nowMs
}

function getDisabledSnapshot () {
  return 0
}

export function useSecondTick (enabled = true) {
  return useSyncExternalStore(
    enabled ? subscribe : () => () => {},
    enabled ? getSnapshot : getDisabledSnapshot,
    getDisabledSnapshot
  )
}
