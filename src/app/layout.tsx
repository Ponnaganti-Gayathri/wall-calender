import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wall Calendar',
  description: 'Interactive wall calendar with day range selector and notes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
