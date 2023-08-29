'use client';

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RadarrErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Radarr</h1>
      <p>{error.message}</p>
    </div>
  )
}