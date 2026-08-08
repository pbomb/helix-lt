import { useState, type MouseEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Category, SignalChainBlock } from '../types'
import { presetBySlug } from '../data/index'
import { getBlockIcon } from './BlockIcon'

const HZ_PARAMS = new Set(['Low Freq', 'Mid Freq', 'High Freq', 'Low Cut', 'High Cut'])

const TYPE_LABELS: Partial<Record<Category, string>> = { eq: 'EQ', pitch_synth: 'Pitch/Synth' }

function formatBlockType(type: Category): string {
  return TYPE_LABELS[type] ?? type.charAt(0).toUpperCase() + type.slice(1)
}

function chainLabel(block: SignalChainBlock): string {
  const base = formatBlockType(block.type)
  const label = block.variant ? `${base} ${block.variant}` : base
  return label === block.model ? label : `${label} (${block.model})`
}

function blockAnchorId(block: SignalChainBlock, i: number): string {
  return `block-${block.type}-${i}`
}

function scrollToBlock(id: string) {
  return (e: MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function formatHz(val: number): string {
  if (val >= 1000) {
    const khz = val / 1000
    return `${+khz.toFixed(3).replace(/\.?0+$/, '')} kHz`
  }
  return `${val} Hz`
}

function formatValue(val: string | number | boolean | null | undefined, param?: string): string {
  if (val === true) return 'on'
  if (val === false) return 'off'
  if (val === null || val === undefined) return '—'
  if (param && HZ_PARAMS.has(param) && typeof val === 'number') return formatHz(val)
  return String(val)
}

// Splits a dense prose note into one paragraph per sentence so long notes
// don't render as a single unbroken wall of text.
function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+(?=[A-Z])/)
}

function NotesText({ text, className }: { text: string; className: string }) {
  return (
    <div className={className}>
      {splitSentences(text).map((sentence, i) => (
        <p key={i}>{sentence}</p>
      ))}
    </div>
  )
}

function BlockCard({ block, id, snapshotNames }: { block: SignalChainBlock; id: string; snapshotNames: string[] }) {
  const params = snapshotNames.length > 0
    ? Object.keys(block.snapshots[snapshotNames[0]] ?? {}).filter(k => k !== 'active')
    : []

  const activeValues = snapshotNames.map(s => block.snapshots[s]?.active)
  const hasActiveField = activeValues.some(v => v !== undefined)
  const activeVaries = hasActiveField && new Set(activeValues.map(String)).size > 1

  const icon = getBlockIcon(block.type)

  return (
    <div className="block-card" id={id}>
      <div className="block-card-header">
        <span className={`block-icon block-icon--${block.type}`}>{icon}</span>
        <span className="block-model">{block.model}</span>
        {block.based_on && <span className="block-based-on">based on {block.based_on}</span>}
      </div>
      {block.notes && <NotesText text={block.notes} className="block-notes" />}
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
                  <td key={s}>{formatValue(block.snapshots[s]?.[param], param)}</td>
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
        {preset.notes && <NotesText text={preset.notes} className="detail-notes" />}
        {preset.note_on_block_limit && (
          <div className="block-limit-note">
            <span className="block-limit-note-label">Block limit note</span>
            <NotesText text={preset.note_on_block_limit} className="block-limit-note-body" />
          </div>
        )}
      </header>

      <section className="signal-chain-section">
        <h2>Signal Chain</h2>
        <div className="signal-chain">
          {preset.signal_chain.map((block, i) => {
            const chainIcon = getBlockIcon(block.type)
            const id = blockAnchorId(block, i)
            return (
              <div key={i} className="chain-wrap">
                <a href={`#${id}`} className="chain-pill" onClick={scrollToBlock(id)}>
                  <span className={`chain-pill-icon block-icon--${block.type}`}>{chainIcon}</span>
                  {chainLabel(block)}
                </a>
                {i < preset.signal_chain.length - 1 && <span className="chain-arrow">→</span>}
              </div>
            )
          })}
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
          {preset.signal_chain.map((block, i) => (
            <BlockCard key={`${block.type}-${i}`} id={blockAnchorId(block, i)} block={block} snapshotNames={snapshotNames} />
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
