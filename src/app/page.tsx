import WallCalendar from '@/components/WallCalendar'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <WallCalendar />
    </main>
  )
}
