export interface SnapshotParams {
  active?: boolean
  [key: string]: string | number | boolean | null | undefined
}

export interface SignalChainBlock {
  type: string
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
