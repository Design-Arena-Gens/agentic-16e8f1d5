import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quantum Dilemma - Explore Parallel Choices',
  description: 'An interactive experience where your choices split reality into parallel timelines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
