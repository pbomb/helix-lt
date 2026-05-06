import { useState } from 'react'
import type { Preset } from './types'
import Catalog from './components/Catalog'
import PresetDetail from './components/PresetDetail'

export default function App() {
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)

  return (
    <div className="app">
      {selectedPreset ? (
        <PresetDetail preset={selectedPreset} onBack={() => setSelectedPreset(null)} />
      ) : (
        <Catalog onSelectPreset={setSelectedPreset} />
      )}
    </div>
  )
}
