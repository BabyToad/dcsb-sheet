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
│   ├── dcsb.scss             # All styles
│   ├── Roll20.d.ts           # Roll20 API type definitions
│   ├── tsconfig.json         # TypeScript config
│   ├── workers.js            # Compiled sheet workers (generated)
│   ├── pug/
│   │   ├── mixins.pug        # Reusable components
│   │   ├── header.pug        # Tab navigation
│   │   ├── character.pug     # PC sheet
│   │   ├── crew.pug          # Crew sheet
│   │   └── rolltemplate.pug  # Roll templates
│   └── ts/
│       ├── calculations.ts   # Auto-calculation functions
│       ├── eventHandlers.ts  # Event bindings
│       └── constants.ts      # Game data (actions, playbooks, etc.)
├── dcsb.html                 # Compiled output (generated)
├── dcsb.css                  # Compiled output (generated)
├── translation.json          # i18n strings
├── sheet.json               # Roll20 sheet metadata
└── package.json
```

## Visual Design: Underground Zine

The sheet uses a diegetic "underground zine" aesthetic - a photocopied document passed between runners. Key elements:

- High contrast B&W base with spot color accent
- Typewriter/hand-drawn typography
- Paper texture, photocopier artifacts
- Hand-annotated feel (circled items, margin notes)

### Color Palette (Confirmed Phase 2)

```scss
$zine-paper: #f5f5f0;      // Aged photocopy paper
$zine-ink: #1a1a1a;        // High contrast black
$zine-grey: #666666;       // Photocopier grey
$zine-accent: #ff1493;     // Neon pink (confirmed)
$status-good: #2d5a27;     // Dark green
$status-warning: #cc7700;  // Orange
$status-danger: #8b0000;   // Dark red
```

### Visual Elements (Phase 2)

| Element | Treatment |
|---------|-----------|
| Section headers | Rubber stamp style, slight rotation, ink bleed effect |
| Section numbers | Hand-circled in accent pink, double circle for hand-drawn feel |
| Tabs | Folder tab shape (clip-path), hover lift, accent underline when active |
| Checkboxes | Hand-drawn imperfection, ink bleed on check, X marks for trauma |
| Paper texture | Layered noise + subtle scan lines + vignette |
| Sections | Dashed borders, tape marks in corners, paper shadow stack |
| Inputs | Dashed underline, accent color on focus |
| XP boxes | Accent pink when filled |
| Heat gauge | Danger red when filled, hazard stripe background |

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

1. **Cybernetics** - Replace special abilities. Tiered system (T2-T5), expandable slots.
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
| 02 | Capability Assessment | Psychometric evaluation | 3 Attributes × 4 Actions (12 total), roll buttons |
| 03 | Condition Report | Medical chart | Stress (9), Trauma (4), Physical Harm, Mental Harm, Armor |
| 04 | Augmentation Record | Tech spec sheet | Cybernetics repeating section with tier/slots |
| 05 | Equipment Manifest | Quartermaster checklist | Load selector, standard items, playbook items |
| 06 | Special Abilities | Classified capabilities | Repeating section for abilities |
| 07 | Vice & Advancement | Off-the-record notes | Vice type/purveyor, Playbook XP (8), Attribute XP (6 each) |
| 08 | Circles | Contact cards | Friends/Rivals repeating section |
| 09 | Notes | Margin scrawl | Free-form text area |

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
