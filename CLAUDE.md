# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Dark City, Shining Babel - Roll20 Character Sheet

## Project Overview

A Roll20 character sheet for Dark City, Shining Babel (DC,SB), a Blades in the Dark hack set in a 2070 Southeast Asian cyberpunk megacity called Babel.

**Current Rulebook**: `../The New Babel.md` (WIP - authoritative source, pulled from Google Doc maintained by Dylan — do not edit)
**Legacy Rulebook**: `../Mini Rulebook.md` (sheet was built from this)
**Reference Project**: `../../The Golden Triangle/swn-sheet/`

## Sheet Update Status

✅ **The New Babel update is complete.** The sheet has been fully updated from Mini Rulebook to match The New Babel.

### Completed Updates

| Area | Status |
|------|--------|
| Terminology: Cybernetics → Augments | ✅ Complete |
| Maintenance system (replaces capacity cap) | ✅ Complete |
| Deep Cuts advancement (4× 6-segment clocks) | ✅ Complete |
| L337 → Hacker rename | ✅ Complete |
| Babel heritage option | ✅ Complete |
| Friends & Rivals system | ✅ Complete |
| Heat Gauge (8 segments) | ✅ Complete |
| Playbook data (items, augments, tiers) | ✅ Complete |
| Standard items cross-check | ✅ Complete |
| Crew sheet updates | ✅ Complete |

See `ROADMAP.md` for detailed implementation history.

## Build Commands

```bash
npm install          # Install dependencies (first time only)
npm run build        # One-time build
npm run dev          # Watch mode with auto-rebuild
```

## Deployment

The compiled output files (`dcsb.html`, `dcsb.css`) are committed to git for easy deployment.

### Using Roll20 Sheet Sync Extension

The `roll20-sheet-sync` Chrome extension (in vault root) allows one-click deployment:

1. Install the extension from `../../roll20-sheet-sync/`
2. Navigate to Roll20 Campaign Settings → Character Sheet Template
3. Configure GitHub source:
   - Repository: `BabyToad/Exocortex`
   - Branch: `main`
   - HTML: `Dark City Shining Babel/dcsb-sheet/dcsb.html`
   - CSS: `Dark City Shining Babel/dcsb-sheet/dcsb.css`
   - Translation: `Dark City Shining Babel/dcsb-sheet/translation.json`
4. Click "Sync Now"

### Manual Deployment

Copy contents of `dcsb.html` and `dcsb.css` to Roll20's Character Sheet Template tabs.

## Project Structure

```
dcsb-sheet/
├── Source/
│   ├── dcsb.pug              # Main template entry point
│   ├── dcsb.scss             # Main styles (imports all partials)
│   ├── _tokens.scss          # Design tokens (colors, typography, spacing)
│   ├── _mixins.scss          # SCSS mixins (box patterns, flex, typography)
│   ├── _header.scss          # Header, ASCII title, tab nav, roll modifier
│   ├── _layout.scss          # Columns, grids, sections
│   ├── _inputs.scss          # Form fields, checkboxes, radios
│   ├── _tracks.scss          # Stress, XP, clocks, heat gauge
│   ├── _character.scss       # Character sheet specific styles
│   ├── _crew.scss            # Crew sheet specific styles
│   ├── _modes.scss           # Tab switching, edit/display modes
│   ├── Roll20.d.ts           # Roll20 API type definitions
│   ├── tsconfig.json         # TypeScript config
│   ├── workers.js            # Compiled sheet workers (generated)
│   ├── pug/
│   │   ├── mixins.pug        # Reusable components (+checkbox-track, etc.)
│   │   ├── header.pug        # ASCII title banner, tabs, roll modifier row
│   │   ├── character.pug     # PC sheet
│   │   ├── crew.pug          # Crew sheet
│   │   └── rolltemplate.pug  # Roll templates
│   └── ts/
│       ├── constants.ts      # Game constants (DICE, LOAD, ROLL_TEMPLATES, etc.)
│       ├── calculations.ts   # Auto-calculation functions, rollWithModifier helper
│       ├── eventHandlers.ts  # Event bindings for all rolls
│       └── playbookData.ts   # Playbook-specific data
├── dcsb.html                 # Compiled output (committed)
├── dcsb.css                  # Compiled output (committed)
├── STYLE_GUIDE.md            # Visual design documentation
├── translation.json          # i18n strings
├── sheet.json               # Roll20 sheet metadata
└── package.json
```

## Visual Design: Reclaimed Corporate Form

The sheet uses a diegetic "reclaimed corporate form" aesthetic - a corporate intake document liberated from Babel's networks, annotated by runners who've made it their own.

**See `STYLE_GUIDE.md` for comprehensive documentation.**

### Header Design

The header features:
- **ASCII Art Title** - Block letters "DC,SB" in terminal amber with glow effect
- **Subtitle** - "DARK CITY, SHINING BABEL" with decorative block characters
- **Status Bar** - Terminal-style system path and connection status
- **Tab Navigation** - CHARACTER / CREW tabs
- **Roll Modifier Row** - Toggle buttons (-1 to +5) for position/effect modifiers

### Concept

This is a corporate intake form - the kind Babel's corps use to process wage-slaves. But it's been **liberated from the network**, passed hand-to-hand through the underworld, annotated by runners. The aesthetic tells a story: corporations made this to dehumanize you, but we've taken it back.

### Visual Layers

1. **Corporate Brutalist (Base)** - Grey institutional paper, monospace typography, numbered sections, form fields
2. **Terminal/Network (ANSI)** - CSS frame borders, amber accent, terminal feel
3. **Reclamation (Punk/Samizdat)** - Hand-circled section numbers, human annotations
4. **Vernacular Babel** - Street culture traces, label-maker aesthetic

### Color Palette

```scss
// Base (Corporate Brutalist)
$form-paper: #e5e5e0;           // Grey government form paper
$form-ink: #1a1a1a;             // Black ink
$form-grey: #888888;            // Bureaucratic grey

// Accent (Terminal/Network)
$terminal-amber: #ffb000;       // Amber phosphor - PRIMARY ACCENT

// Status
$status-good: #2d5a27;          // Dark green
$status-warning: #cc7700;       // Orange
$status-danger: #8b0000;        // Dark red (harm, trauma)
```

### Visual Elements

| Element | Treatment |
|---------|-----------|
| Title banner | ASCII block letters with CSS frame, amber glow |
| Section headers | CSS borders, monospace, all caps |
| Section numbers | Hand-circled in amber (human annotation) |
| Tabs | Monospace, amber underline when active |
| Roll modifier | Toggle buttons, amber fill when selected |
| Checkboxes | Amber fill when checked |
| Sections | Dashed borders, clean |
| Inputs | Dashed underline, amber on focus |
| XP/Stress boxes | Amber when filled |
| Heat gauge | Danger red when filled |

### Typography

- **Everything is monospace** - this is a terminal/form document
- Headers differentiated by CAPS, weight, and spacing - not font change
- No decorative fonts

## DC,SB Game Mechanics

### Actions (12 total, in 3 attributes — same structure as BitD, different names)

| Acuity (≈Insight) | Grit (≈Prowess) | Resolve |
|-------------------|-----------------|---------|
| Hack | Brawl | Consort |
| Recon | Hunt | Dominate |
| Scrutinize | Skulk | Sway |
| Tamper | Vandalize | Finesse |

### Playbooks (6)
- Face (manipulation/influence)
- Fixer (connections/planning)
- Hacker (hacking/tech) — *formerly L337*
- MidNighter (stealth/infiltration)
- Murk (shooting/tracking)
- Street Warrior (combat/intimidation)

### Crew Types (4)
- Firebrands (revolutionaries)
- Leeches (vice dealers)
- Runners (corporate mercenaries)
- Zokus (street racers/fighters)

### Custom Mechanics (vs Blades in the Dark)

1. **Roll Modifier System** - Toggle buttons (-1 to +5) apply dice modifiers to all rolls, auto-reset after rolling
2. **Augments** - Replace BitD Special Abilities. Tiered system (T2-T5) with maintenance clocks instead of capacity cap
3. **Score Flow** - Engagement → Score (Heat Gauge fills) → Disengagement Roll → Entanglements
4. **Heat Gauge** - 8-segment gauge; fills during score, empty segments = dice for Disengagement Roll
5. **Disengagement Roll** - Roll remaining Heat Gauge segments to escape cleanly
6. **Mental Harm** - Separate from physical harm, cleared via Vice
7. **Friends & Rivals** - Playbook-specific Friends list with Friend/Rival relation selection
8. **Advancement** - Deep Cuts system: 4× 6-segment advancement clocks

## Sheet Worker Patterns

### Roll With Modifier Helper

All rolls use the `rollWithModifier` helper that:
1. Reads the current roll modifier setting
2. Adds/subtracts dice from the pool
3. Resets modifier to 0 after rolling
4. Includes modifier notes in roll output

```typescript
rollWithModifier(
    [action, 'character_name'],           // Attrs to fetch
    v => int(v[action]),                  // Base dice calculator
    (dice, v, modNotes) => {              // Roll execution
        // dice = final pool, modNotes = "+2d Position" etc.
    }
);
```

### Attribute Change Handler
```typescript
on("change:attr_name", (eventInfo) => {
    getAttrs(["attr_name", "other_attr"], (v) => {
        setAttrs({ derived_attr: calculatedValue });
    });
});
```

### Repeating Section IDs
```typescript
getSectionIDs("repeating_section", (ids) => {
    const attrs = ids.map(id => `repeating_section_${id}_field`);
    getAttrs(attrs, (v) => { /* process */ });
});
```

## Development Phases

### Original Build (Mini Rulebook) ✅
- [x] Phase 0: Foundation
- [x] Phase 1: Information Architecture
- [x] Phase 2: Visual Design
- [x] Phase 3: Core Implementation (rolls, modifiers, calculations)
- [x] Phase 4: Custom Features (Augments, Heat Gauge, etc.)
- [x] Phase 5: Crew Sheet & Polish

### The New Babel Update ✅
- [x] Rename Cybernetics → Augments throughout
- [x] Replace capacity cap with maintenance clocks
- [x] Update Heat Gauge (6 → 8 segments)
- [x] Update advancement to Deep Cuts (4× 6-segment clocks)
- [x] Rename L337 → Hacker, update items/Augments
- [x] Add Babel to Heritage options
- [x] Add playbook-specific Friends lists + Friend/Rival selection
- [x] Update Augment tiers per playbook
- [x] Cross-check standard items
- [x] Crew sheet updates

## Information Architecture

### Character Sheet Sections

| # | Section | Framing | Content |
|---|---------|---------|---------|
| 01 | Subject Identification | Corporate intake form | Name, Alias, Look, Playbook, Heritage, Background, Vice |
| 02 | Capability Assessment | Psychometric evaluation | 3 Attributes × 4 Actions (12 total), 4× Advancement Clocks (Deep Cuts) |
| 03 | Condition Report | Medical chart | Stress (9), Trauma (4), Harm levels, Armor |
| 04 | Augmentation Record | Tech spec sheet | Augments with tier, description, maintenance clocks |
| 05 | Equipment Manifest | Quartermaster checklist | Load selector, standard items, playbook items |
| 06 | Friends & Rivals | Contact cards | Playbook-specific Friends list, Friend/Rival selection |
| 07 | Notes | Margin scrawl | Free-form text area |
| 08 | Clocks | Mission tracking | Custom progress clocks (4, 6, 8, 10, 12 segments) |

### Crew Sheet Sections

| # | Section | Framing | Content |
|---|---------|---------|---------|
| 01 | Crew Identification | Syndicate charter | Name, Type, Reputation, Hunting Grounds, Lair |
| 02 | Crew Stats | Performance metrics | Tier (0-4), Hold, Rep (12), Heat (9), Wanted (4), Vault (16), Advancement |
| 03 | Score Tracker | Mission control | Heat Gauge (8), Disengagement Roll |
| 04 | Crew Notes | Mission logs | Free-form text area |
| 05 | Clocks | Faction/mission tracking | Custom progress clocks (4, 6, 8, 10, 12 segments) |
| 06 | Crew Upgrades | Asset manifest | Lair, Training, Quality, Cohort upgrade checkboxes |
| 07 | Crew Type Upgrades | Crew-specific upgrades | Repeating section populated by crew type |
| 08 | Crew Abilities | Special operations | Repeating section for crew abilities |
| 09 | Cohorts | Personnel files | Gang/Expert repeating section with harm/edges/flaws |
| 10 | Claims | Territory map | Repeating section for held claims |

## References

- [Blades in the Dark SRD](https://bladesinthedark.com/basics)
- [Roll20 Sheet Development](https://wiki.roll20.net/Building_Character_Sheets)
- [joesinghaus/Blades-template](https://github.com/joesinghaus/Blades-template)
