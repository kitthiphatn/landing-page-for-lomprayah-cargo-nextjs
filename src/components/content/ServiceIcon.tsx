const PATHS: Record<string, string> = {
  boat: 'M3 15h18l-3 5H6zM7 15V9h10v6M10 9V5h4v4',
  truck:
    'M2 6h11v10H2zM13 10h4l4 4v2h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  store: 'M4 10h16v10H4zM3 10l2-6h14l2 6M9 20v-5h6v5',
}

export function ServiceIcon({ name, className }: { name?: string | null; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name ?? 'box'] ?? PATHS.box} />
    </svg>
  )
}
