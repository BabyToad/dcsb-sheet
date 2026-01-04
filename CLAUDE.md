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

### Color Palette

```scss
$zine-paper: #f5f5f0;      // Aged photocopy paper
$zine-ink: #1a1a1a;        // High contrast black
$zine-accent: #ff1493;     // Neon pink (placeholder - TBD in Phase 2)
```

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

- [x] Phase 0: Foundation (current)
- [ ] Phase 1: Information Architecture
- [ ] Phase 2: Visual Design
- [ ] Phase 3: Core Implementation
- [ ] Phase 4: Custom Features (Cybernetics, Heat Gauge, etc.)
- [ ] Phase 5: Crew Sheet & Polish

## References

- [Blades in the Dark SRD](https://bladesinthedark.com/basics)
- [Roll20 Sheet Development](https://wiki.roll20.net/Building_Character_Sheets)
- [joesinghaus/Blades-template](https://github.com/joesinghaus/Blades-template)
