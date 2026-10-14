// True when now falls inside the optional start/end window set in the admin
export function isWithinWindow(startsAt?: string | null, endsAt?: string | null): boolean {
  const now = Date.now()
  if (startsAt && new Date(startsAt).getTime() > now) return false
  if (endsAt && new Date(endsAt).getTime() < now) return false
  return true
}
