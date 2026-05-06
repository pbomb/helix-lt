import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Block } from '../types'
import { presetBySlug } from '../data/index'

interface BlockWithKey extends Block {
  key: string
}

function formatValue(val: string | number | boolean | null | undefined): string {
  if (val === true) return 'on'
  if (val === false) return 'off'
  if (val === null || val === undefined) return '—'
  return String(val)
}

function BlockCard({ block, snapshotNames }: { block: BlockWithKey; snapshotNames: string[] }) {
  const params = snapshotNames.length > 0
    ? Object.keys(block.snapshots[snapshotNames[0]] ?? {}).filter(k => k !== 'active')
    : []

  const activeValues = snapshotNames.map(s => block.snapshots[s]?.active)
  const hasActiveField = activeValues.some(v => v !== undefined)
  const activeVaries = hasActiveField && new Set(activeValues.map(String)).size > 1

  return (
    <div className="block-card">
      <div className="block-card-header">
        <span className="block-model">{block.model}</span>
        {block.based_on && <span className="block-based-on">based on {block.based_on}</span>}
      </div>
      <table className="param-table">
        <thead>
          <tr>
            <th className="param-name-col">Parameter</th>
            {snapshotNames.map(s => (
              <th key={s} className="snapshot-col">{s.replace(/^\d+_/, '').replace(/_/g, ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasActiveField && (
            <tr className={activeVaries ? 'row-varies' : ''}>
              <td className="param-name">active</td>
              {snapshotNames.map(s => {
                const v = block.snapshots[s]?.active
                return (
                  <td key={s} className={v === false ? 'val-bypassed' : v === true ? 'val-active' : ''}>
                    {formatValue(v)}
                  </td>
                )
              })}
            </tr>
          )}
          {params.map(param => {
            const values = snapshotNames.map(s => block.snapshots[s]?.[param])
            const varies = new Set(values.map(String)).size > 1
            return (
              <tr key={param} className={varies ? 'row-varies' : ''}>
                <td className="param-name">{param}</td>
                {snapshotNames.map(s => (
                  <td key={s}>{formatValue(block.snapshots[s]?.[param])}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function PresetDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [playingNotesOpen, setPlayingNotesOpen] = useState(false)

  const preset = presetBySlug[slug ?? '']

  if (!preset) {
    return (
      <div className="preset-detail">
        <button className="back-button" onClick={() => navigate('/')}>← Back to catalog</button>
        <p>Preset not found.</p>
      </div>
    )
  }

  const snapshotNames = Object.keys(preset.snapshots)

  const orderedBlocks: BlockWithKey[] = preset.signal_chain.map(modelName => {
    const entry = Object.entries(preset.blocks).find(([, b]) => b.model === modelName)
    if (!entry) return null
    return { key: entry[0], ...entry[1] }
  }).filter((b): b is BlockWithKey => b !== null)

  const notes = preset.playing_notes
  const { tuning, key: key_, capo, technique, snapshot_cues, tone_control, pickup_notes, reference } = notes ?? {}

  return (
    <div className="preset-detail">
      <button className="back-button" onClick={() => navigate('/')}>← Back to catalog</button>

      <header className="detail-header">
        <h1>{preset.preset_name}</h1>
        <div className="detail-meta">
          <span>{preset.artist}</span>
          <span className="meta-sep">·</span>
          <span>{preset.album}</span>
          {preset.master_bpm && <><span className="meta-sep">·</span><span>{preset.master_bpm} BPM</span></>}
          {preset.tuning && <><span className="meta-sep">·</span><span>{preset.tuning}</span></>}
          {notes?.capo && <><span className="meta-sep">·</span><span>Capo {notes.capo}</span></>}
        </div>
        {preset.notes && <p className="detail-notes">{preset.notes}</p>}
      </header>

      <section className="signal-chain-section">
        <h2>Signal Chain</h2>
        <div className="signal-chain">
          {preset.signal_chain.map((model, i) => (
            <div key={i} className="chain-wrap">
              <div className="chain-pill">{model}</div>
              {i < preset.signal_chain.length - 1 && <span className="chain-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="blocks-section">
        <h2>Effect Blocks</h2>
        <div className="snapshot-column-labels">
          <span className="label-spacer" />
          {snapshotNames.map(s => (
            <span key={s} className="snapshot-label">{s.replace(/^\d+_/, '').replace(/_/g, ' ')}</span>
          ))}
        </div>
        <div className="block-list">
          {orderedBlocks.map(block => (
            <BlockCard key={block.key} block={block} snapshotNames={snapshotNames} />
          ))}
        </div>
      </section>

      <section className="snapshots-section">
        <h2>Snapshots</h2>
        <div className="snapshot-cards">
          {snapshotNames.map(name => {
            const snap = preset.snapshots[name]
            return (
              <div key={name} className="snapshot-card">
                <div className="snapshot-card-header">
                  <span className="snapshot-footswitch">{snap.footswitch}</span>
                  <span className="snapshot-name">{name.replace(/^\d+_/, '').replace(/_/g, ' ')}</span>
                </div>
                <p className="snapshot-desc">{snap.description}</p>
                {snap.pickup_position && (
                  <div className="snapshot-pickup">Pickup: {snap.pickup_position}</div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {notes && (
        <section className="playing-notes-section">
          <button
            className="collapsible-toggle"
            onClick={() => setPlayingNotesOpen(o => !o)}
          >
            {playingNotesOpen ? '▾' : '▸'} Playing Notes
          </button>
          {playingNotesOpen && (
            <div className="playing-notes-body">
              {key_ && <div><strong>Key:</strong> {key_}</div>}
              {tuning && <div><strong>Tuning:</strong> {tuning}</div>}
              {capo && <div><strong>Capo:</strong> {capo}</div>}
              {pickup_notes && <div><strong>Pickup:</strong> {pickup_notes}</div>}
              {technique && <div><strong>Technique:</strong> {technique}</div>}
              {snapshot_cues && <div><strong>Snapshot cues:</strong> {snapshot_cues}</div>}
              {tone_control && <div><strong>Tone control:</strong> {tone_control}</div>}
              {reference && <div><strong>Reference:</strong> {reference}</div>}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
