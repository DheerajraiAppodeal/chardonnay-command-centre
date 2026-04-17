import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Overview from './pages/Overview'
import Operations from './pages/Operations'
import ReleaseTrain from './pages/ReleaseTrain'
import Team from './pages/Team'
import AIImpact from './pages/AIImpact'

export default function App() {
  const [lastSynced, setLastSynced] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )

  function handleRefresh() {
    setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <NavBar lastSynced={lastSynced} onRefresh={handleRefresh} />
        <main className="flex-1 px-6 py-6 max-w-[1400px] mx-auto w-full">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/release" element={<ReleaseTrain />} />
            <Route path="/team" element={<Team />} />
            <Route path="/ai" element={<AIImpact />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
