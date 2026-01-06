# Dark City, Shining Babel - Roll20 Character Sheet

## Project Overview

A Roll20 character sheet for Dark City, Shining Babel (DC,SB), a Blades in the Dark hack set in a 2070 Southeast Asian cyberpunk megacity called Babel.

**Source Material**: `../Mini Rulebook.md`
**Reference Project**: `../../The Golden Triangle/swn-sheet/`

## Build Commands

```bash
npm install          # Install dependencies (first time only)
npm run build        # One-time build
npm run dev          # Watch mode with auto-rebuild
```

## Project Structure

```
dcsb-sheet/
├── Source/
│   ├── dcsb.pug              # Main template entry point
│   ├── dcsb.scss             # Main styles (imports tokens & mixins)
│   ├── _tokens.scss          # Design tokens (colors, typography, spacing)
│   ├── _mixins.scss          # SCSS mixins (box patterns, flex, typography)
│   ├── Roll20.d.ts           # Roll20 API type definitions
│   ├── tsconfig.json         # TypeScript config
│   ├── workers.js            # Compiled sheet workers (generated)
│   ├── pug/
│   │   ├── mixins.pug        # Reusable components (+checkbox-track, etc.)
│   │   ├── header.pug        # Tab navigation
│   │   ├── character.pug     # PC sheet
│   │   ├── crew.pug          # Crew sheet
│   │   └── rolltemplate.pug  # Roll templates
│   └── ts/
│       ├── constants.ts      # Game constants (DICE, LOAD, ROLL_TEMPLATES, etc.)
│       ├── calculations.ts   # Auto-calculation functions
│       ├── eventHandlers.ts  # Event bindings
│       └── playbookData.ts   # Playbook-specific data
├── dcsb.html                 # Compiled output (generated)
├── dcsb.css                  # Compiled output (generated)
├── STYLE_GUIDE.md            # Visual design documentation
├── translation.json          # i18n strings
├── sheet.json               # Roll20 sheet metadata
└── package.json
```

## Visual Design: Reclaimed Corporate Form

The sheet uses a diegetic "reclaimed corporate form" aesthetic - a corporate intake document liberated from Babel's networks, annotated by runners who've made it their own.

**See `STYLE_GUIDE.md` for comprehensive documentation.**

### Concept

This is a corporate intake form - the kind Babel's corps use to process wage-slaves. But it's been **liberated from the network**, passed hand-to-hand through the underworld, annotated by runners. The aesthetic tells a story: corporations made this to dehumanize you, but we've taken it back.

### Visual Layers

1. **Corporate Brutalist (Base)** - Grey institutional paper, monospace typography, numbered sections, form fields
2. **Terminal/Network (ANSI)** - Box-drawing borders (┌─┐│└─┘), amber accent, terminal feel
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
| Section headers | Box-drawing borders (┌──┐), monospace, all caps |
| Section numbers | Hand-circled in amber (human annotation over corporate form) |
| Tabs | Monospace, amber underline when active |
| Checkboxes | Amber fill when checked (not black) |
| Paper texture | Subtle scan lines + slight vignette |
| Sections | Dashed borders, clean (no tape marks) |
| Inputs | Dashed underline, amber on focus |
| XP/Stress boxes | Amber when filled |
| Heat gauge | Danger red when filled |

### Typography

- **Everything is monospace** - this is a terminal/form document
- Headers differentiated by CAPS, weight, and spacing - not font change
- No decorative fonts

## Key Differences from Standard Blades in the Dark

### Actions (12 total, in 3 attributes)

| Acuity | Grit | Resolve |
|--------|------|---------|
| Hack | Brawl | Consort |
| Recon | Hunt | Dominate |
| Scrutinize | Skulk | Sway |
| Tamper | Vandalize | Finesse |

### Playbooks (6)
- Face (manipulation/influence)
- Fixer (connections/planning)
- L337 (hacking/tech)
- MidNighter (stealth/infiltration)
- Murk (shooting/tracking)
- Street Warrior (combat/intimidation)

### Crew Types (4)
- Firebrands (revolutionaries)
- Leeches (vice dealers)
- Runners (corporate mercenaries)
- Zokus (street racers/fighters)

### Custom Mechanics (Phase 4)

1. **Cybernetics** - Fully replace BitD Special Abilities. Tiered system (T2-T5), capacity limit expandable via XP. Each augment has name, tier, and description visible at all times.
2. **Heat Gauge** - 6-clock tracked during scores, affects Disengagement Roll.
3. **Disengagement Roll** - Escape mechanic based on Heat Gauge state.
4. **Mental Harm** - Separate from physical harm, cleared via Vice.
5. **Circles** - "I know a guy" mechanic using Consort.

## CSS Patterns

### Tab Switching (CSS sibling selectors)
```scss
.tab-input:not([value="character"]) ~ .character { display: none; }
.tab-input:not([value="crew"]) ~ .crew { display: none; }
```

### Checkbox-based Trackers
```scss
input[type="checkbox"] {
    display: none;
    &:checked + span { background: $zine-ink; }
}
```

## Sheet Worker Patterns

### Attribute Change Handler
```typescript
on("change:attr_name", (eventInfo) => {
    getAttrs(["attr_name", "other_attr"], (v) => {
        // Calculate derived values
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

- [x] Phase 0: Foundation
- [x] Phase 1: Information Architecture
- [x] Phase 2: Visual Design
- [ ] Phase 3: Core Implementation
- [ ] Phase 4: Custom Features (Cybernetics, Heat Gauge, etc.)
- [ ] Phase 5: Crew Sheet & Polish

## Information Architecture (Phase 1)

### Character Sheet Sections

| # | Section | Framing | Content |
|---|---------|---------|---------|
| 01 | Subject Identification | Corporate intake form | Name, Alias, Look, Playbook, Heritage, Background |
| 02 | Capability Assessment | Psychometric evaluation | 3 Attributes × 4 Actions (12 total), Playbook XP, Attribute XP |
| 03 | Condition Report | Medical chart | Stress (9), Trauma (4), Harm levels, Armor |
| 04 | Augmentation Record | Tech spec sheet | Cybernetics with tier & description (replaces BitD Special Abilities) |
| 05 | Equipment Manifest | Quartermaster checklist | Load selector, standard items, playbook items |
| 06 | Vice | Off-the-record notes | Vice type/purveyor/details |
| 07 | Circles | Contact cards | Friends/Rivals repeating section |
| 08 | Notes | Margin scrawl | Free-form text area |

**Note**: DC,SB has no separate Special Abilities section - Cybernetics replace that role entirely.

### Crew Sheet Sections

| # | Section | Framing | Content |
|---|---------|---------|---------|
| 01 | Crew Identification | Syndicate charter | Name, Type, Reputation, Hunting Grounds, Lair |
| 02 | Crew Stats | Performance metrics | Tier (0-4), Hold, Rep (12), Turf, Heat (9), Wanted (4) |
| 03 | Score Tracker | Mission control | Heat Gauge (6), Current Score, Disengagement Roll |
| 04 | Crew Upgrades | Asset manifest | Lair, Training, Quality upgrade checkboxes |
| 05 | Crew Abilities | Special operations | Repeating section for crew abilities |
| 06 | Cohorts | Personnel files | Gang/Expert repeating section with harm/edges/flaws |
| 07 | Faction Status | Intelligence briefing | Faction relationship matrix (-3 to +3) |
| 08 | Claims | Territory map | Repeating section for held claims |
| 09 | Vault | Treasury | Coin counter, Vault track (16) |
| 10 | Crew Notes | Mission logs | Free-form text area |

### Key DC,SB-Specific Elements

1. **Mental Harm Track** - Separate from physical, cleared via Vice (not healing)
2. **Heat Gauge** - 6-segment clock for active scores, determines Disengagement dice
3. **Cybernetics Section** - Tier-based (T2-T5), capacity system, expandable via XP
4. **Disengagement Roll** - Uses unticked Heat Gauge segments as dice pool

## References

- [Blades in the Dark SRD](https://bladesinthedark.com/basics)
- [Roll20 Sheet Development](https://wiki.roll20.net/Building_Character_Sheets)
- [joesinghaus/Blades-template](https://github.com/joesinghaus/Blades-template)
