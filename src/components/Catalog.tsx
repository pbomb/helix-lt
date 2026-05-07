import { useState } from 'react'
import { Link } from 'react-router-dom'
import { presetsByArtist, toSlug } from '../data/index'
import AlbumArt from './AlbumArt'

export default function Catalog() {
  const artists = Object.keys(presetsByArtist).sort()
  const [expandedArtists, setExpandedArtists] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    artists.forEach(a => { init[a] = true })
    return init
  })

  function toggleArtist(artist: string) {
    setExpandedArtists(prev => ({ ...prev, [artist]: !prev[artist] }))
  }

  return (
    <div className="catalog">
      <header className="catalog-header">
        <h1>Helix LT Presets</h1>
        <p className="catalog-subtitle">Line 6 Helix LT preset catalog</p>
      </header>
      <div className="artist-list">
        {artists.map(artist => (
          <div key={artist} className="artist-section">
            <button
              className="artist-toggle"
              onClick={() => toggleArtist(artist)}
            >
              <span className="artist-chevron">{expandedArtists[artist] ? '▾' : '▸'}</span>
              <span className="artist-name">{artist}</span>
              <span className="artist-count">{presetsByArtist[artist].length} presets</span>
            </button>
            {expandedArtists[artist] && (
              <ul className="song-list">
                {presetsByArtist[artist].map(preset => (
                  <li key={preset.preset_name}>
                    <Link
                      className="song-button"
                      to={`/presets/${toSlug(preset.preset_name)}`}
                    >
                      <AlbumArt thumbnail={preset.thumbnail} album={preset.album} size={36} />
                      <span className="song-name">{preset.preset_name}</span>
                      <span className="song-meta">{preset.album} · {preset.master_bpm} BPM</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
