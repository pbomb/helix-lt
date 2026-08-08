# AGENTS.md — Helix LT Preset Generation Guide

This file documents everything learned from building Helix LT preset JSON files for a
specific rig, so future sessions can generate accurate presets without repeating
research or parameter mistakes.

---

## Rig Context

- **Guitar:** 1990 Fender Stratocaster Plus Deluxe (Lace Sensor pickups)
- **Amp:** Fender Super Champ XD (15W, 6V6 power tubes, Fender-voiced)
- **Processor:** Line 6 Helix LT running **in front of** the amp (not amp+cab into FRFR)
- **No amp+cab blocks are used.** Running a modeled amp+cab into a real tube amp
  stacks two complete amp/power-amp systems against each other, causing volume
  inconsistency between snapshots and unwanted dirt even at low gain settings. Preamp
  blocks are acceptable when the real amp used differs significantly from this rig's amp.

### Rig compensation strategy (used throughout)
Lace Sensors are lower output than most artists' confirmed pickups (humbuckers, hot
singles). The Super Champ XD has higher clean headroom than most confirmed studio/live
amps (Vox AC30, Marshall JCM800, Selmer, Diezel VH4). To compensate:
1. Add a mild always-on overdrive (e.g. Stupor OD at low Drive) even where not
   originally confirmed, to simulate natural amp saturation the real rig would have had for free.
2. Raise the confirmed pedal's Drive/Gain by roughly 1.0–2.0 above documented settings.
3. Raise Parametric EQ **Level** by +2 to +4 dB to push the tube amp's input stage harder.
4. If still too clean: raise the physical amp volume so the power tubes work harder.

### Alternative signal path considered (not yet adopted)
If the person's amp has an effects loop (e.g. Mesa Boogie California Tweed), the
**four cable method (4CM)** is architecturally superior: drives/fuzzes/boosts go in
front of the real amp's preamp; modulation/delay/reverb go in the loop after the
preamp, before the power amp. This avoids all amp-modeling conflicts. Preamp-only
Helix blocks (no power amp/cab) are also worth trying for defining the front-end
voicing of a specific confirmed amp (e.g. Essex A30 preamp only) while letting the
real amp's power section do the rest.

---

## Critical Workflow: Always Consult the YAML Before Writing Settings

A YAML file (`helix-models-all.yaml`) contains the authoritative list of available
Helix models and their **parameter names** (not always their ranges/types — see below).
**Before writing any preset settings, grep/view the relevant model entries in the YAML.**
Never guess a parameter name or invent a model that "sounds right" — verify it exists.

The canonical source repo for these YAMLs is:
`https://github.com/pbomb/helix-lt/tree/main/src/data/effects`
(raw files fetchable at `https://raw.githubusercontent.com/pbomb/helix-lt/refs/heads/main/src/data/effects/<file>.yaml`)

### The YAML does NOT reliably include:
- Parameter value ranges (min/max)
- Parameter value types (continuous vs. toggle vs. select)
- Percentage vs. 0–10 scale distinctions

**These must be confirmed by the person from their actual hardware.** Do not assume
a 0–100% scale — many parameters are actually 0–10. When corrected, apply the fix
retroactively to all presets using that parameter and remember it going forward.

---

## Parameter Corrections Discovered This Session

These were wrong in earlier presets and are now known-correct. Apply these everywhere:

| Model | Parameter | Wrong (early) | Correct |
|---|---|---|---|
| Kinky Boost | Boost | Variable dB value | On/Off toggle only, fixed boost amount |
| Kinky Boost | Drive | — | IS a numeric value (0–10), not a toggle |
| Adriatic Delay | BBD Size | "Small"/"Medium"/"Large" strings | Numeric: 1024, 2048, 4096, 8192 |
| Adriatic Delay | Rate | 0 (to disable mod) | Minimum is **0.1 Hz** — 0 is invalid. Use 0.1 + Depth 0 to disable. |
| Ganymede (reverb) | Low Cut / High Cut | Assumed present | **Does not exist.** Use single `Tone` knob instead. |
| Dynamic Hall (reverb) | Room Size | Snapshot-variable | **Must be a FIXED value per preset.** Changing it between snapshots changes the algorithm and causes an audible bump/glitch. |
| Dynamic Hall (reverb) | Diffusion | 0–10 scale assumed | **Percentage (0–100%)** |
| Optical Trem | Intensity | Set to 18–20 | Range is **0–10**. Use ~1.5–2.0 for subtle. |
| Ubiquitous Vibe | Intensity | Set to 20 | Range is **0–10**. Use ~2.0 for subtle. |
| Chorus (generic) | Depth | Set to 30–35 | Range is **0–10**, not percent. Use ~3.0–3.5 for subtle. |
| Transistor Tape | Wow/Flutter | Assumed separate Wow + Flutter | **Single combined parameter**, no separate Bass/Treble either. |
| Parametric EQ | Mid bands | Assumed Low-Mid + High-Mid (2 bands) | **Only ONE parametric Mid band**, plus Low shelf and High shelf. Consolidate any "dual mid" design into one Mid Freq/Q/Gain. |
| Cosmos Echo | Ramp | Omitted | Controls lag when manually sweeping Time (0 = instant, 10 = slow mechanical lag like real RE-201 tape change). **Use 0** for all tempo-synced presets since Time isn't being manually swept. |
| Wringer Fuzz | Fuzz Type | String "Fuzz" | **0 or 1 only** (0 = mid-scooped/high-octane "Fuzz 1", 1 = thick/mid-focused wall-of-sound "Fuzz 2"). Choose 0 for articulate/lead fuzz, 1 for heavy rhythm/doom fuzz. |
| Industrial Fuzz | Oscillator | Omitted | **On/Off toggle.** On = enables self-oscillation circuit (needed for chaotic/oscillating intro sounds). Off = stable fuzz only, even at low Stability. |
| Industrial Fuzz | Stability | — | **Counterintuitive: LOWER = more unstable/oscillating (chaos). HIGHER = stable fuzz.** |

### Naming convention fix
**Always use "Parametric EQ" as the display name AND the `model` field value** —
not just "Parametric". Using "Parametric" alone causes the block to be visually
overlooked/missed when scanning a preset, since it doesn't match what's shown in the
signal chain summary. Consistency between `model` field and signal chain listing
matters more than matching the raw internal Helix name.

### Still unconfirmed / open questions
- Whether `Motion` on Dynamic Hall is 0–10 or percentage (asked, not yet answered).
- Full parameter ranges for many modulation/pitch blocks not yet used in a preset.
- No dedicated "Small Clone" (EHX) chorus model exists — best substitute found so
  far is **PlastiChorus** (modded Arion SCH-Z) for a similarly simple, lush analog character.
- No dedicated "Sub Octave Fuzz"/Roctave Divider model exists on Helix LT. Best
  approximation for MXR Blue Box-style tone: **Wringer Fuzz → Boctaver** in series
  (Boctaver's -1 Oct / -2 Oct independently mirrors the Blue Box's dual-octave design).

---

## Model Substitution Reference (confirmed pedal → closest Helix model)

| Real pedal/amp | Helix model | Notes |
|---|---|---|
| Boss SD-1 | Stupor OD | Asymmetric clipping, mid-forward |
| Boss OD-3 | Stupor OD | Same model used as nearest approximation |
| Ibanez TS-808 | Scream 808 | Symmetric soft clipping, low cut, mid hump |
| Maxon SD9 / DS830 | Hedgehog D9 | Harder clipping than TS-808, fuller range |
| MXR Distortion+ / DOD OD-250 | Top Secret OD | Same LM741 op-amp circuit — accurate match |
| Pro Co RAT | Ratatouille Dist | Also approximates Marshall ShredMaster (similar topology) |
| Boss DS-1 (Japan MIJ) | Deez One Vintage | NOT Deez One Mod (that's the Keeley mod version) |
| Klon Centaur | Minotaur | Confirmed notable user: Nick Valensi |
| Xotic EP Booster | Kinky Boost | Boost is a toggle, not variable — see corrections above |
| Dallas Rangemaster | Deranged Master | "Can take your head off" per Helix's own warning — works best into an already-driven amp |
| MXR Dyna Comp | Red Squeeze | Confirmed on Albert Hammond Jr.'s board |
| EHX Op-Amp Big Muff V4/V5 | Bighorn Fuzz (Ram's Head) | Not identical (Op-Amp version harsher) but closest available |
| EHX Big Muff Pi (Triangle/original) | Triangle Fuzz | Use for Nirvana/Cobain — original circuit, not Ram's Head |
| EHX Russian Big Muff | Dark Dove Fuzz | Used for Strokes "12:51" synth-tone approximation (Tone at min) |
| Z.Vex Fuzz Factory | Industrial Fuzz | Exact model match. See Stability/Oscillator notes above. |
| MXR Blue Box | Wringer Fuzz + Boctaver (stacked) | No single-block equivalent exists |
| DigiTech Whammy | Pitch Wham / Poly Wham | Poly Wham has Heel Shift/Toe Shift in semitones; Pitch Wham similar |
| Boss OC-2 | Boctaver | -1 Oct / -2 Oct independent level controls |
| MXR Phase 90 | Script Mod Phase | Simple Rate/Mix/Level |
| MXR Phase 100 / Mu-Tron Bi-Phase | Script Mod Phase | Best available approx; use very low Rate (~0.3) per Corgan's own "turn it all the way down" instruction |
| EHX Small Stone | Pebble Phaser | Has unique "Color" parameter |
| EHX Deluxe Memory Man | Elephant Man | Good for Echorec/tape-delay-style wobble via Mode+Depth |
| Boss DM-2 (w/ Adrian mod) | Adriatic Delay | Analog-voiced, BBD Size selectable |
| Roland RE-201 Space Echo | Cosmos Echo | Has Bass/Treble/FBTone tone-shaping unlike simpler delays |
| Maestro Echoplex EP-3 / Boss RE-20 | Transistor Tape | Single Wow Flutter param, no Bass/Treble |
| EHX Small Clone | PlastiChorus (imperfect substitute) | No exact model exists |
| Boss CE-1 | 70s Chorus | Confirmed for Strokes (Boss CE-2 on Valensi's board, CE-1 closest available) |
| Fender optical tremolo | Optical Trem | Speed + Intensity only, no Wave Shape param |
| Shin-ei Uni-Vibe | Ubiquitous Vibe | Mode: Chorus (keeps dry signal) or Vibrato (pure pitch mod) |
| Vox AC30 (Top Boost) | Essex A30 | Has **Cut** not Mid — Cut works in reverse (higher = more cut) |
| Fender Twin Reverb / "Hot Rod DeVille" substitute | US Double Nrm | No dedicated DeVille model exists; Twin Reverb is closest 6L6 Fender clean platform. **No Presence parameter.** |
| Marshall JCM800 2203 | Brit 2203 | Has unique **Input** parameter (which jack) other Marshalls lack |
| Marshall Super Lead / Plexi | Brit Plexi Jump | Has separate **Bright Drive** and **Normal Drive** (two channels) |
| Diezel VH4 | Das Benzin Lead / Das Benzin Mega | Has **Deep** parameter (bass depth), NOT Hum |

---

## Delay & Tempo Sync Conventions

- **Prefer tempo-synced note divisions** (`TempoSync1: true` + `Note Sync`) over fixed
  ms values whenever a division lands within ~20ms of the song's natural delay time
  at its BPM. This keeps delays musically locked if BPM is retapped.
- **Use fixed ms only** when no division lands within tolerance (rare — usually only
  for deliberate off-grid slapback or when a song has a tempo too irregular to lock to).
- Always show both the Note Sync value AND the resulting ms at that BPM in a comment,
  e.g. `"Time": "352ms (d1/8 at 128 BPM)"`, for human readability.
- Default division guidance: **dotted eighth (d1/8)** for atmospheric/lead delays,
  **eighth (1/8)** for tight rhythmic delays, **quarter (1/4)** for spacious ambient,
  **sixteenth (1/16)** for slapback.
- For general (non-song-specific) presets with no fixed tempo, default **Master BPM
  to 100–120** and note that tap tempo should be used per song.
- Songs with a confirmed tempo change mid-song (e.g. Franz Ferdinand "Take Me Out":
  ~104 BPM intro → ~133 BPM main section) should set Master BPM to the dominant
  section and use a fixed ms value for the other section's delay if no division syncs.

---

## Signal Chain & Block Conventions

- **8-block serial path (1A) limit.** Always count blocks before finalizing. If a
  design needs more than 8, either consolidate mutually-exclusive effects into shared
  blocks toggled per snapshot (see "Bodysnatchers" combined preset below) or cut
  something.
- **Noise Gate is always first block.** Threshold in dB (negative), Decay in ms.
  Rough guidance: -70 to -75 dB (very open, clean tones) → -65/-68 (light drive) →
  -58/-62 (moderate OD) → -52/-55 (high gain/fuzz) → -48/-50 (max gain, wall of fuzz).
- **Compression, if used, goes second** (after gate, before drive/fuzz blocks), and
  is typically an always-on constant across all snapshots rather than toggled — it
  represents a rig-level characteristic, not a per-song choice.
- **Mutually exclusive drive/fuzz blocks**: when a song uses different distortion
  pedals in different sections, model each confirmed pedal as its own block and
  toggle `active: true/false` per snapshot rather than trying to make one block do
  double duty with wildly different settings.
- **Preamp-only blocks (no cab/power-amp), when used, go after overdrive/distortion/
  fuzz blocks and before modulation blocks** (chorus, phaser, vibe, etc.) and delay/
  reverb. Rationale: this mirrors a real pedals-into-amp-front-end signal path —
  pedals hit the amp's preamp stage first, and modulation/time-based effects
  conventionally sit after the amp in the signal path (or in an effects loop on a
  real rig with one, per the 4CM note above). Only add a preamp block when a specific
  real amp is confirmed for the song/section and adds value beyond what the pedals +
  EQ already cover — it's an optional coloration layer, not a required block, and
  Helix only allows one Preamp model per preset (snapshots can vary its parameters
  but not swap the model).
- **EQ block always compensates for the missing amp+cab voicing** — this is doing
  double duty: (1) recreating some of the omitted amp's tonal signature (e.g. mid
  scoop for Big Muff/Marshall combos, mid-forward "telephone filter" for Strokes/Fender
  combos) and (2) raising overall Level to compensate for lost amp gain staging.
- **Reverb**: Dynamic Hall (has Low Cut/High Cut/Low Gain — good for Radiohead/Muse/
  darker tones) vs. Ganymede (single Tone knob, smoother/simpler — good for Strokes/
  dream-pop-adjacent tones). Choose based on whether frequency-specific shaping is needed.

---

## Multi-Song / Multi-Guitarist Preset Consolidation

When two parts (e.g. two guitarists in the same song) can share most of their signal
chain, consolidate into ONE preset with MORE snapshots rather than two separate
presets — this saves blocks by sharing Noise Gate/EQ/Delay/Reverb, with only the
genuinely different elements (distinct drive pedals, radically different EQ due to
different tunings) split into separate blocks toggled per snapshot pair.

Example: Radiohead "Bodysnatchers" — Jonny (standard tuning, Boss OD-3) and Thom
(Drop D, MXR Distortion+) were consolidated from 2 presets × 4 blocks = 8 blocks
down to 1 preset × 5 blocks (shared Noise Gate, Parametric EQ, Transistor Tape;
separate Stupor OD and Top Secret OD blocks toggled per snapshot pair) — a real savings
that still captures both confirmed rigs accurately.

Document tuning changes required between snapshot groups explicitly in a
`tuning_strategy` field, since retuning mid-song is a real physical constraint the
person must plan around (not something the preset can solve).

---

## Research & Sourcing Standards

- Always search for confirmed gear before building — never guess a pedal/amp from
  genre stereotypes. Prioritize: direct artist quotes/interviews > tech/gear-tech
  interviews (e.g. Butch Vig, Nigel Godrich production interviews) > gear sites
  (Equipboard, Reverb News, Premier Guitar) > fan wikis (MuseWiki, King of Gear) >
  generic "gear guide" blogspam.
- When a specific model doesn't exist on the Helix (e.g. Sub Octave Fuzz, Small
  Clone), say so explicitly in the preset notes rather than silently substituting —
  document what was used instead and why, so the limitation is visible.
- When two eras/rigs are confirmed for the same artist (e.g. Strokes' Is This It-era
  RAT+Jekyll&Hyde+MicroAmp vs. New Abnormal-era Jekyll&Hyde+MXR MicroAmp+Deep Blue
  Delay), pick the era matching the specific song being requested, and note the
  discrepancy if building a general/album-spanning preset.
- Cite sources in a `confirmed_sources` array in the JSON so the person can verify
  or dig deeper later. Keep citation indices tied to the actual search results used
  in that turn — don't reuse citation numbers across different research subjects
  in the same conversation (this caused an error once — Strokes sources got
  attributed to a Smashing Pumpkins preset).

---

## Album Thumbnails (Spotify)

Every preset file includes a `thumbnail` field with a direct image URL for the album,
sourced via the Spotify Web API's Search endpoint
(https://developer.spotify.com/documentation/web-api/reference/search).

- **Find the album:** search Spotify for the artist + album (via the Search API with
  an OAuth client-credentials token if available, or by locating the album's
  `open.spotify.com/album/<id>` URL through a general web search when API credentials
  aren't configured in this environment).
- **Get the artwork hash:** fetch `https://open.spotify.com/oembed?url=https://open.spotify.com/album/<id>`
  (no auth required) and read `thumbnail_url` — it returns a 300x300 image at
  `https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02<hash>`. The trailing
  `<hash>` (after the size-prefix segment) is what you need.
- **Build the 64x64 URL:** Spotify's image CDN encodes size in a fixed-length prefix
  before the hash. `ab67616d00004851` is the **64x64** prefix (matches every existing
  preset's thumbnail — do not use the 300x300 `ab67616d00001e02` or 640x640
  `ab67616d0000b273` prefixes). Combine it with the hash and use the `i.scdn.co` host
  to match existing presets: `https://i.scdn.co/image/ab67616d00004851<hash>`.
- **Verify before writing:** `curl -sI <url>` should return `HTTP 200` with
  `content-type: image/jpeg` before adding it to the JSON.
- If no Spotify album match exists (e.g. band logo rather than a specific album), an
  alternate stable image URL is acceptable — see `the-strokes-general.json`'s use of a
  logo host — but Spotify album art is strongly preferred and should be the default.

---

## JSON File Structure (established convention)

Each preset file should include, at minimum:
```
{
  "preset_name": "...",
  "artist": "...",
  "album": "...",
  "thumbnail": "https://i.scdn.co/image/ab67616d00004851<hash> (64x64 Spotify album art — see Album Thumbnails section above)",
  "tuning": "...",
  "master_bpm": <number>,
  "notes": "<long-form explanation of design decisions, confirmed rig, deviations>",
  "confirmed_sources": ["...", "..."],
  "signal_chain": [
    {
      "type": "<Category — see below>",
      "variant": "<optional, disambiguates two blocks of the same type>",
      "model": "<exact Helix model name>",
      "based_on": "<real pedal/amp>",
      "notes": "<why this model, what it approximates, any caveats>",
      "snapshots": {
        "<snapshot_key>": { "param": "value", "active": true }
      }
    }
  ],
  "snapshots": {
    "<snapshot_key>": {
      "footswitch": "FS#",
      "description": "<what this snapshot sounds like and when to use it>",
      "pickup_position": "..."
    }
  },
  "playing_notes": {}
}
```

`signal_chain` is a single ordered array — the order of blocks in the array is the
order they appear in the Helix's signal path. There is no separate `blocks` map; each
block's model, notes, and per-snapshot params live inline in its `signal_chain` entry.

Each block's `type` must be one of the `Category` values defined in `src/types.ts`:
`amp`, `cab`, `delay`, `distortion`, `dynamics`, `eq`, `filter`, `input`, `modulation`,
`pitch_synth`, `preamp`, `reverb`, `wah`. This drives the block's icon and color in the
UI (`src/components/BlockIcon.tsx`), so it must reflect how the block is *used* in this
chain, not just the model's on-device menu category — e.g. an amp model placed in a
preamp-only slot is `type: "preamp"`, not `"amp"`; the always-present first block
(gate) is `type: "input"` even though "Noise Gate" lives under Dynamics on the device.
Use `variant` (e.g. a pedal name or position) to disambiguate two blocks that share the
same `type` in one chain.

For general/album-spanning presets (not tied to one song), also include a
`songs_that_inspired_each_snapshot` or `representative_songs` field per snapshot so
the person knows which tracks map to which snapshot.

---

## Things to Ask the Person (don't assume)

- Whether a parameter's displayed range is 0–10 vs. 0–100% — the YAML doesn't say,
  and this has been wrong multiple times already (see corrections table above).
  When in doubt, ask rather than guess a scale.
- Whether they want song-specific or general/album-spanning presets.
- Which processor (Helix LT vs. GT-6) — this session moved from GT-6 to Helix LT
  partway through; always confirm before building if ambiguous.
- Whether amp+cab modeling should be used at all — this session explicitly moved
  away from it due to the person's real tube amp, but that decision is rig-specific
  and should be re-confirmed if the person's amp changes.
