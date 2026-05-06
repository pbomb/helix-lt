import { Routes, Route } from 'react-router-dom'
import Catalog from './components/Catalog'
import PresetDetail from './components/PresetDetail'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/presets/:slug" element={<PresetDetail />} />
      </Routes>
    </div>
  )
}
