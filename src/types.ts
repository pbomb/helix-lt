export interface SnapshotParams {
  active?: boolean
  [key: string]: string | number | boolean | null | undefined
}

// The block categories as defined on the Helix itself (top-level keys of
// helix-models-all.yaml, plus 'input'). Determines both the chain-pill label
// and (via BlockIcon's ICONS) the icon/color shown for the block. Note that
// 'amp' and 'preamp' share the same underlying model list on the device —
// the same amp model can be placed in either block slot — so category is a
// property of how a block is used, not of the model name. Likewise 'input':
// "Noise Gate" and "Hard Gate" are Dynamics-category models, but every
// preset here uses one as the fixed first block's gate mode (the always-
// present Input block), never as a discrete mid-chain Dynamics pedal — so
// that usage gets its own category rather than 'dynamics'.
export type Category =
  | 'amp'
  | 'cab'
  | 'delay'
  | 'distortion'
  | 'dynamics'
  | 'eq'
  | 'filter'
  | 'input'
  | 'modulation'
  | 'pitch_synth'
  | 'preamp'
  | 'reverb'
  | 'wah'

export interface SignalChainBlock {
  type: Category
  // Disambiguates two blocks of the same type in one chain (e.g. whose pedal,
  // or which of two identical models) — shown alongside the type in the label.
  variant?: string
  model: string
  based_on?: string
  notes?: string
  snapshots: Record<string, SnapshotParams>
}

export interface SnapshotMeta {
  footswitch: string
  description: string
  pickup_position?: string
}

export interface PlayingNotes {
  tuning?: string
  key?: string
  capo?: number | null
  pickup_notes?: string
  technique?: string
  snapshot_cues?: string
  tone_control?: string
  timing_note?: string
  timing_critical?: string
  reference?: string
  [key: string]: string | number | null | undefined
}

export interface Preset {
  preset_name: string
  artist: string
  album: string
  thumbnail: string
  tuning: string
  master_bpm?: number
  capo?: number
  notes?: string
  signal_chain: SignalChainBlock[]
  snapshots: Record<string, SnapshotMeta>
  playing_notes?: PlayingNotes
  note_on_block_limit?: string
}
