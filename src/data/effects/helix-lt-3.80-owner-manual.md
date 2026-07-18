# Helix LT 3.80 — Preset-Building Reference

Condensed from the official Helix LT 3.80 Owner's Manual. This file captures the
hardware/architecture facts needed to build valid, realistic Helix LT presets in
`src/data/presets/*.json`. Per-effect parameter details (params, ranges, based-on
pedals/amps) live in the sibling `helix-*-effects.yaml` files and are **not**
duplicated here — read this file for how a preset is *structured*, and the YAML
files for what each block/model's knobs do.

## Signal chain architecture

- A preset has **two Paths (1 and 2)**, each of which can be **serial (single)**
  or **parallel (split into 1A/1B or 2A/2B)** via Split/Merge blocks.
- Path 1 can be routed into Path 2 for more complex chains ("super serial" — up to
  32 block locations total, DSP permitting).
- Each serial path segment has **8 processing block locations** max.
- Split types: **Y** (even split, stereo balance per side), **A/B** (adjustable
  ratio via Route To), **Crossover** (frequency-based: treble → A, bass → B),
  **Dynamic** (level-based: above threshold → A, below → B).
- A **Merge > Mixer** block appears wherever parallel paths recombine.
- Blocks are mono or stereo per-model (stereo shown with a stereo icon in HX Edit).
  Stereo imaging rules:
  - Amp+Cab, Amp, Preamp, and Poly effects blocks are **always mono** — any stereo
    signal feeding them collapses to mono. Put only mono blocks before an amp/preamp.
  - Any mono effects block collapses preceding stereo blocks on the same path to mono.
  - Legacy Distortion/Dynamics/Pitch-Synth are mono; Legacy Filter/Reverb are stereo;
    Legacy Modulation/Delay vary (some mono-in/stereo-out, narrowed by their Mix param).

### Block count limits (per preset)
- **Input blocks**: up to 4 (1–2 per path).
- **Output blocks**: up to 4 (1–2 per path).
- **Amp+Cab / Amp / Preamp**: any combination, up to 4 total (2 per path max).
- **Cab blocks** (incl. those inside Amp+Cab): up to 4 Single Cab (2/path), or up
  to 2 Dual Cab (1/path).
- **IR blocks**: up to 4 Single IR @1024-pt (2/path), or 2 Single IR @2048-pt
  (1/path), or 2 Dual IR (1/path).
- **Poly/high-DSP effects** (Feedbacker, Poly Sustain, Poly Detune, Poly Pitch,
  Wham, Capo, 12-String): 1 per path max.
- **Looper**: 1 per preset.
- Grayed-out/unavailable models in the model list are skipped automatically when a
  path is already full or a limit is hit.
- DSP is finite and shared across Path 1 and Path 2 (each path/DSP is independent);
  amps, reverbs, and Poly effects are DSP-heavy, EQ/Dynamics/Volume-Pan/Send-Return
  are cheap. A stereo block costs ~2x its mono version's DSP.

## Blocks reference (structural, not per-model params)

- **Input**: source options include Multi (guitar+Variax simultaneously — default),
  Guitar, Variax, Variax Magnetics, Return 1/2/1+2 (as extra inputs), USB 3/4, 5/6,
  7/8. Guitar/Multi inputs expose **Guitar In-Z** (impedance: lower = softer/lower
  gain, higher = tighter/brighter, or Auto). Also has Gate Threshold/Decay.
- **Output**: source Multi (1/4", XLR, Digital, USB1/2 simultaneously — default),
  1/4" only, XLR only, Send 1/2, USB 3/4 or 5/6, or (Path 1 only) route into
  Path 2A/2B/2A+B. Every output block has **Pan** and **Level** knobs — Level is
  the recommended place to balance a path's overall output volume across presets.
- **Send/Return**: Helix LT has 2 mono sends/returns (pairable for stereo), usable
  as an FX loop for outboard stompboxes, or as extra ins/outs. An FX Loop or Return
  block "claims" the underlying jack, making it unavailable elsewhere in the preset.
- **Looper**: 1 Switch, 6 Switch, or Shuffling type; one Looper block per preset,
  assignable to a footswitch. Looper recording/playback does **not** survive Preset
  Spillover between presets.
- **IR**: Single (mono) or Dual (stereo) blocks loading cabinet/mic impulse
  responses; parameters Low Cut, High Cut, Mix, Level (Dual adds Polarity).

## Snapshots

- Each preset has **8 snapshots** — think of them as sub-presets that instantly
  recall, per snapshot:
  - Block bypass (on/off) state for every processing block except Looper (can be
    excluded per-block via "Snapshot Bypass" = Off, useful e.g. for a Boost you
    want to control manually regardless of snapshot).
  - Any parameter assigned to a controller, including manual "Snapshot" controller
    assignments (up to **64 controller assignments per preset total**, shared
    across all controller types).
  - Command Center instant messages (MIDI CC, Bank/Prog, MMC, Qwerty Hotkey,
    HX Looper, Ext Amp, CC Toggle state).
  - Tempo, only if Global Settings > MIDI/Tempo > Tempo Select = "Per Snapshot"
    (default is "Per Preset," i.e. one tempo for the whole preset).
- Snapshots **cannot** swap which model occupies a block or reorder/add/remove
  blocks — only parameter values and bypass states change between snapshots.
- Turn a Delay/Reverb/FX Loop block's **Trails** parameter On for seamless
  spillover of tails when switching snapshots (or presets, with Preset Spillover).
- Typical use: one snapshot per song section (Intro, Verse, Chorus, Solo, Outro...).
  This matches how presets in this repo already use
  `"1_clean_verse"` / `"2_heavy_chorus"`-style snapshot keys.
- Snapshot Edit Behavior (Global Settings > Preferences > Snapshot Edits):
  **Recall** (default — live tweaks persist when you leave/return to a snapshot
  until the preset is saved) vs. **Discard** (tweaks revert to last-saved state on
  snapshot change).

## Footswitches & controllers

- Footswitch modes: **Preset** (bank/preset select), **Stomp** (toggle blocks
  on/off, aka FS1–FS8 style), **Snapshot** (recall snapshots 1–8), and combinable
  layouts (Preset/Stomp, Snap/Stomp, 8 Snapshots, etc. — configurable in
  Global Settings > Footswitches).
- A single footswitch can be assigned to bypass one or more blocks at once — but
  be aware a snapshot can silently override a footswitch-driven bypass state if
  both target the same block (documented gotcha in the manual).
- **Bypass Assign**: manual, e.g. an EXP pedal or Variax knob position can engage
  or bypass a block automatically (e.g., Wah/Poly Wham auto-engages past heel
  position on EXP 1).
- **Controller Assign**: any block parameter can be tied to a controller — EXP 1
  (built-in pedal), EXP 2 (rear jack, or toe-switch toggle on the built-in pedal),
  Variax volume/tone knobs, MIDI CC, or a Snapshot. Adding a Wah/Pitch
  Wham/Poly Wham block auto-assigns its Position to EXP 1; adding a Volume
  Pedal/Pan block auto-assigns Position to EXP 2. Max 64 controller assignments
  per preset (shared with snapshot-controlled params).
- **Command Center**: assigns MIDI CC/PC/MMC, Qwerty Hotkey, HX Looper, or Ext
  Amp messages to a footswitch or to "Instant" (fires automatically on snapshot
  recall) — useful for e.g. switching an external amp channel per snapshot
  without spending a footswitch on it.

## Tempo & MIDI

- Tap tempo, MIDI Clock in/out, and MIDI CC control are all supported.
- Tempo Select (Global Settings > MIDI/Tempo) is **Per Preset** by default; set to
  **Global** to keep delay trails' tempo stable across preset changes with
  spillover, or **Per Snapshot** to vary tempo within a preset.
- Reserved global MIDI CCs (cannot be reused as parameter controllers) include:
  CC0/32 (Bank MSB/LSB), CC64 (Tap Tempo), CC68 (Tuner on/off), CC69 (Snapshot
  select: 0–7 = Snapshot 1–8, 8 = next, 9 = previous), CC1–2 (EXP1/EXP2 emulate),
  CC49–59 (footswitch emulation), CC75–80 (parameter knobs 1–6), CC81 (page
  left/right). Any Delay's Time synced to tempo (note-division mode) will re-sync
  to the new preset's BPM on preset change.

## Preset Spillover & Dynamic DSP

- **True Preset Spillover** (Global Settings > Preferences, or ACTION+HOME) lets
  delay/reverb trails ring into the next preset by sacrificing Path 2 (only Path 1
  is used/loaded while active). Looper does not spill over. Useful context if a
  preset's notes describe seamless song-to-song transitions.
- **Dynamic DSP**: fewer high-DSP blocks (amps, reverbs, Poly effects, stereo
  effects) fit versus cheap ones (EQ, Dynamics, Volume/Pan, Send/Return); the two
  paths are independent DSP engines, so spreading heavy blocks across Path 1 and
  Path 2 avoids hitting the ceiling.

## Practical implications for writing presets in this repo

- `signal_chain` in preset JSON should respect the 8-blocks-per-serial-path limit
  (or explicitly note Path A/B parallel routing / "super serial" if a chain is
  longer) and the per-category block-count caps above.
- Prefer mono effects/drive/dynamics blocks ahead of the amp block; reserve
  stereo blocks (chorus, some delays/reverbs) for after the amp, consistent with
  real Helix signal-flow behavior.
- `snapshots` blocks in preset JSON map naturally onto the 8 physical Helix
  snapshots — keep to ≤8 named snapshots per preset, and remember only bypass
  state, controller-assigned parameter values, Command Center instants, and
  (optionally) tempo differ between them, not the block list itself.
- When a preset's `notes` describe a footswitch toggling multiple parameters at
  once (like `ctl_pedal_assign` in existing presets), that behavior is best
  modeled as snapshot switching on real Helix LT hardware (as already noted in
  `creep.json`), since a single footswitch cannot natively scale one parameter
  by an arbitrary formula — it either recalls a snapshot or toggles/controls one
  assigned parameter.
- `Trails: true` on Delay/Reverb blocks should be set whenever a preset's design
  relies on tails ringing through a snapshot or preset change.
- Tempo-synced delay/mod times should be expressed the way the hardware does:
  either a note division (e.g. "1/8") relative to `master_bpm`, or a raw ms value.
