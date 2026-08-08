import type { ReactElement } from 'react'
import type { Category } from '../types'

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
  // Hard-clipped (squared) waveform
  distortion: (
    <svg {...SVG_PROPS}>
      <polyline points="2,12 5,12 7,5 9,5 9,19 15,19 15,5 17,5 19,12 22,12" />
    </svg>
  ),
  // Compressor/gate gain-reduction curve
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
  // Resonant sweep — envelope/frequency filter
  filter: (
    <svg {...SVG_PROPS}>
      <path d="M2,19 Q7,19 9,10" />
      <polyline points="6,11 9,6 12,11" />
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
  // Double musical note — pitch shifting / synth
  pitch_synth: (
    <svg {...SVG_PROPS}>
      <line x1="9" y1="18" x2="9" y2="8" />
      <line x1="9" y1="8" x2="18" y2="6" />
      <line x1="18" y1="6" x2="18" y2="16" />
      <ellipse cx="7" cy="18" rx="3" ry="2" />
      <ellipse cx="16" cy="16" rx="3" ry="2" />
    </svg>
  ),
  // Amp head with control knobs, no cabinet — preamp-only, no power amp
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
  // Speaker cabinet — cone in a cabinet, no amp head
  cab: (
    <svg {...SVG_PROPS}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Wah pedal treadle, viewed from the side
  wah: (
    <svg {...SVG_PROPS}>
      <path d="M4,19 L9,6 L17,6 L20,19 Z" />
      <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Guitar jack — the fixed, always-present Input block
  input: (
    <svg {...SVG_PROPS}>
      <circle cx="9" cy="12" r="7" />
      <circle cx="9" cy="12" r="2.5" />
      <line x1="16" y1="12" x2="22" y2="12" />
    </svg>
  ),
}

export function getBlockIcon(type: Category): ReactElement {
  return ICONS[type]
}
