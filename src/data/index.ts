import type { Preset } from '../types'

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const presetModules = import.meta.glob('./presets/*.json', { eager: true })

export const allPresets: Preset[] = Object.values(presetModules) as Preset[]

export const presetsByArtist: Record<string, Preset[]> = allPresets.reduce<Record<string, Preset[]>>((acc, preset) => {
  const artist = preset.artist
  if (!acc[artist]) acc[artist] = []
  acc[artist].push(preset)
  return acc
}, {})

Object.keys(presetsByArtist).forEach(artist => {
  presetsByArtist[artist].sort((a, b) => a.preset_name.localeCompare(b.preset_name))
})

export const presetBySlug: Record<string, Preset> = Object.fromEntries(
  allPresets.map(p => [toSlug(p.preset_name), p])
)
