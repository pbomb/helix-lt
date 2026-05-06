import type { Preset } from '../types'
import creep from './presets/creep.json'
import just from './presets/just.json'
import noSurprises from './presets/no-surprises.json'
import thereThere from './presets/there-there.json'
import weirdFishes from './presets/weird-fishes.json'
import bodysnatchers from './presets/bodysnatchers.json'
import theAdultsAreTalking from './presets/the-adults-are-talking.json'
import selfless from './presets/selfless.json'
import badDecisions from './presets/bad-decisions.json'

export const allPresets: Preset[] = [
  creep as Preset,
  just as Preset,
  noSurprises as Preset,
  thereThere as Preset,
  weirdFishes as Preset,
  bodysnatchers as Preset,
  theAdultsAreTalking as Preset,
  selfless as Preset,
  badDecisions as Preset,
]

export const presetsByArtist: Record<string, Preset[]> = allPresets.reduce<Record<string, Preset[]>>((acc, preset) => {
  const artist = preset.artist
  if (!acc[artist]) acc[artist] = []
  acc[artist].push(preset)
  return acc
}, {})

Object.keys(presetsByArtist).forEach(artist => {
  presetsByArtist[artist].sort((a, b) => a.preset_name.localeCompare(b.preset_name))
})
