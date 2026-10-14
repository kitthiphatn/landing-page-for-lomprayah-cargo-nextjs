// Splits what the visitor typed into unique, upper-case tracking numbers
export function parseTrackingNumbers(input: string): string[] {
  return Array.from(
    new Set(
      input
        .toUpperCase()
        .split(/[\s,]+/)
        .filter(Boolean),
    ),
  )
}
