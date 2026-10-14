// Tracking numbers this visitor looked up, kept only in their own browser
const KEY = 'lp_recent_tracking'
const MAX = 8

export function readRecent(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(list)
      ? list.filter((x): x is string => typeof x === 'string').slice(0, MAX)
      : []
  } catch {
    return []
  }
}

export function addRecent(numbers: string[]) {
  try {
    const next = [...numbers, ...readRecent().filter((n) => !numbers.includes(n))].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage blocked; nothing to remember
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
