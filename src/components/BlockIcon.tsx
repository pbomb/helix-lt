import type { ReactElement } from 'react'

type Category =
  | 'multi'
  | 'distortion'
  | 'dynamics'
  | 'eq'
  | 'modulation'
  | 'delay'
  | 'reverb'
  | 'pitch'
  | 'preamp'
  | 'amp'
  | 'ampcab'

const SVG_PROPS = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: '1em',
  height: '1em',
  'aria-hidden': true,
}

const ICONS: Record<Category, ReactElement> = {
  // Two inputs merging into one output — Helix "Multi" input type
  multi: (
    <svg {...SVG_PROPS}>
      <path d="M4 7L12 12M4 17L12 12" />
      <line x1="12" y1="12" x2="20" y2="12" />
      <polyline points="17,9 20,12 17,15" />
    </svg>
  ),
  // Hard-clipped (squared) waveform
  distortion: (
    <svg {...SVG_PROPS}>
      <polyline points="2,12 5,12 7,5 9,5 9,19 15,19 15,5 17,5 19,12 22,12" />
    </svg>
  ),
  // Compressor gain-reduction curve
  dynamics: (
    <svg {...SVG_PROPS}>
      <line x1="3" y1="21" x2="3" y2="4" strokeWidth={1} strokeOpacity={0.5} />
      <line x1="3" y1="21" x2="21" y2="21" strokeWidth={1} strokeOpacity={0.5} />
      <polyline points="3,21 9,15 13,12 21,10" />
    </svg>
  ),
  // Parametric EQ bell curve
  eq: (
    <svg {...SVG_PROPS}>
      <line x1="2" y1="16" x2="22" y2="16" strokeWidth={1} strokeOpacity={0.5} />
      <path d="M2,16 Q5,16 8,8 Q11,2 14,8 Q17,16 20,16" />
    </svg>
  ),
  // Sine wave (LFO oscillation)
  modulation: (
    <svg {...SVG_PROPS}>
      <path d="M2,12 Q5,4 8,12 Q11,20 14,12 Q17,4 20,12 Q21,16 22,12" />
    </svg>
  ),
  // Clock face — time-based effect
  delay: (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  // Expanding arcs from a source point
  reverb: (
    <svg {...SVG_PROPS}>
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12,19 Q6,13 12,7" />
      <path d="M12,19 Q18,13 12,7" />
      <path d="M12,19 Q3,11 12,3" />
      <path d="M12,19 Q21,11 12,3" />
    </svg>
  ),
  // Double musical note — pitch shifting
  pitch: (
    <svg {...SVG_PROPS}>
      <line x1="9" y1="18" x2="9" y2="8" />
      <line x1="9" y1="8" x2="18" y2="6" />
      <line x1="18" y1="6" x2="18" y2="16" />
      <ellipse cx="7" cy="18" rx="3" ry="2" />
      <ellipse cx="16" cy="16" rx="3" ry="2" />
    </svg>
  ),
  // Amp head with control knobs, no cabinet — preamp-only, no cab/power-amp
  preamp: (
    <svg {...SVG_PROPS}>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
    </svg>
  ),
  // Amp head with control knobs, no cabinet
  amp: (
    <svg {...SVG_PROPS}>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
    </svg>
  ),
  // Amp head stacked on a speaker cabinet
  ampcab: (
    <svg {...SVG_PROPS}>
      <rect x="5" y="3" width="14" height="6" rx="1" />
      <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <circle cx="12" cy="15.5" r="3.5" />
    </svg>
  ),
}

const MODEL_CATEGORY: Record<string, Category> = {
  // Input / Multi
  'Noise Gate': 'multi',

  // Distortion
  'Stupor OD': 'distortion',
  'Minotaur': 'distortion',
  'Dark Dove Fuzz': 'distortion',
  'Industrial Fuzz': 'distortion',
  'Wringer Fuzz': 'distortion',
  'Ratatouille Dist': 'distortion',
  'Scream 808': 'distortion',
  'Hedgehog D9': 'distortion',
  'Teemah!': 'distortion',
  'Top Secret OD': 'distortion',

  // Preamp (preamp-only blocks — no cab/power-amp modeling, per rig setup)
  'US Double Nrm': 'preamp',
  'Tweed Blues Nrm': 'preamp',
  'Cali Rectifire': 'preamp',

  // Dynamics
  'Red Squeeze': 'dynamics',

  // EQ
  'Parametric EQ': 'eq',
  'Parametric': 'eq',

  // Modulation
  '70s Chorus': 'modulation',
  'Chorus': 'modulation',
  'Script Mod Phase': 'modulation',
  'Ubiquitous Vibe': 'modulation',

  // Delay
  'Simple Delay': 'delay',
  'Adriatic Delay': 'delay',
  'Cosmos Echo': 'delay',
  'Transistor Tape': 'delay',

  // Reverb
  'Ganymede': 'reverb',
  'Dynamic Hall': 'reverb',

  // Pitch / Synth
  'Boctaver': 'pitch',
  'Pitch Wham': 'pitch',
  'Poly Pitch': 'pitch',
  'Poly Wham': 'pitch',
}

export function getBlockIcon(model: string): ReactElement | null {
  const category = MODEL_CATEGORY[model]
  return category ? ICONS[category] : null
}

export function getBlockCategory(model: string): Category | null {
  return MODEL_CATEGORY[model] ?? null
}
