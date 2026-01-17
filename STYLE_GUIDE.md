# Dark City, Shining Babel - Style Guide

## Visual Concept: "Reclaimed Corporate Form"

This is a corporate intake form - the kind Babel's corps use to process wage-slaves. But it's been **liberated from the network**, passed hand-to-hand through the underworld, annotated by runners who've made it their own.

The aesthetic tells a story: corporations made this to dehumanize you, but we've taken it back.

---

## Visual Layers

### Layer 1: Corporate Brutalist (Base)
The bones of the form. Cold, clinical, dehumanizing.
- Grey institutional paper background
- System/monospace typography
- Numbered sections like a government form
- Grid-based, form-field heavy
- Dashed underlines for data entry
- "SUBJECT IDENTIFICATION" style headers

### Layer 2: Terminal/Network (ANSI Influence)
The digital substrate - this was pulled from Babel's wired networks.
- Box-drawing characters (`┌─┐│└─┘`) for borders throughout
- Amber phosphor for "live data" fields
- Monospace everything that's "data"
- Cursor-blink feeling on active fields
- Limited palette approach (ref: 16colo.rs)

### Layer 3: Reclamation (Punk/Samizdat)
The human layer - runners marking up the corporate form.
- Hand-circled section numbers
- Margin annotations, corrections
- Highlighter-accent color that feels hand-applied
- Samizdat "blurred carbon copy" texture in places

### Layer 4: Vernacular Babel (Street Culture)
Traces of the city's multilingual, multicultural streets.
- Label-maker tape aesthetic for some headers
- Hand-drawn elements breaking the grid
- Sticker aesthetic for items/gear

---

## Color Palette

### Base Colors (Corporate Brutalist)
| Token | Hex | Usage |
|-------|-----|-------|
| `$form-paper` | #e5e5e0 | Main background - grey government form |
| `$form-ink` | #1a1a1a | Primary text, borders |
| `$form-grey` | #888888 | Labels, secondary text, form field hints |
| `$form-grey-light` | #bbbbbb | Disabled/faded elements |

### Accent Color (Terminal/Network)
| Token | Hex | Usage |
|-------|-----|-------|
| `$terminal-amber` | #ffb000 | **Primary accent** - focus, checked, active, hover |

### Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `$status-good` | #2d5a27 | Positive states (dark green) |
| `$status-warning` | #cc7700 | Warning states (orange) |
| `$status-danger` | #8b0000 | Harm, trauma, danger (dark red) |

### Color Application
- **Paper background**: `$form-paper` - institutional grey, NOT warm cream
- **Primary text**: `$form-ink` - high contrast black
- **Labels/headers**: `$form-grey` - bureaucratic, faded
- **Active/focus**: `$terminal-amber` - network access feel
- **Checked boxes**: `$terminal-amber` - filled = active data
- **Section numbers**: `$terminal-amber` - human annotation over corporate form
- **Harm/trauma**: `$status-danger` - danger states

---

## Typography

### Font Stack
```scss
$font-mono: 'Courier New', Courier, monospace;  // Primary - EVERYTHING
```

**Everything is monospace.** This is a terminal/form document. No decorative fonts.

### Type Scale
| Token | Size | Usage |
|-------|------|-------|
| `$type-xs` | 9px | Fine print, load values |
| `$type-sm` | 10px | Labels, secondary info |
| `$type-base` | 12px | Body text, inputs |
| `$type-md` | 14px | Section content headers |
| `$type-lg` | 16px | Character name, major headers |
| `$type-xl` | 20px | Sheet title only |

### Typography Rules
- Headers differentiated by **CAPS, weight, and spacing** - not font change
- All caps for section headers, form labels
- Normal case for user-entered data
- No italic except for optional flavor text

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `$space-1` | 2px | Tight gaps (between checkbox boxes) |
| `$space-2` | 4px | Small gaps (inline elements) |
| `$space-3` | 8px | Field gaps, padding |
| `$space-4` | 12px | Component padding |
| `$space-5` | 16px | Section gaps |

**Legacy aliases**: `$spacing-xs/sm/md/lg` map to corresponding `$space-*` values.

---

## Box/Checkbox Sizing

Use the `square-box()` mixin with explicit sizes:
```scss
@include square-box(12px);  // Standard checkboxes
@include square-box(14px);  // Action dots, XP boxes
@include square-box(16px);  // Prominent checkboxes
```

---

## Border Styles

### CSS Borders
| Token | Value | Usage |
|-------|-------|-------|
| `$border-dashed` | 1px dashed $form-grey | Form fields, separators |

Other border styles defined inline where needed (solid, double).

### Box-Drawing Characters (ANSI)
Used throughout for section headers and borders:
```
┌─────────────────────────────────────┐
│ CONTENT                             │
└─────────────────────────────────────┘
```

| Character | Code | Name |
|-----------|------|------|
| ┌ | U+250C | Top-left corner |
| ┐ | U+2510 | Top-right corner |
| └ | U+2514 | Bottom-left corner |
| ┘ | U+2518 | Bottom-right corner |
| ─ | U+2500 | Horizontal line |
| │ | U+2502 | Vertical line |
| ├ | U+251C | Left T-junction |
| ┤ | U+2524 | Right T-junction |
| ┬ | U+252C | Top T-junction |
| ┴ | U+2534 | Bottom T-junction |
| ┼ | U+253C | Cross |

---

## Component Patterns

### Section Headers
```
┌─────────────────────────────────────┐
│ 01  SUBJECT IDENTIFICATION          │
└─────────────────────────────────────┘
```
- Box-drawing border (via `::before`/`::after` content)
- Section number in amber, hand-circled style
- Header text in caps, letter-spaced

### Form Fields
```
LEGAL NAME: ________________
            [user input here]
```
- Label above or inline, all caps, grey
- Dashed underline for input
- Amber underline on focus

### Checkbox Tracks (Stress, XP, etc.)
```
STRESS  [■][■][■][□][□][□][□][□][□]
```
- Filled boxes use **amber background**
- Empty boxes are outlined only
- Consistent sizing across all tracks

### Repeating Sections (Cybernetics, Items)
```
[✓] T3 NEURAL INTERFACE
    Gain +1d when interfacing with...
────────────────────────────────────
[ ] T4 COMBAT REFLEXES
    When you would take harm...
```
- Checkbox for "installed/equipped"
- Tier badge in amber
- Description in smaller text
- Dashed separator between entries

---

## Interactive States

| State | Treatment |
|-------|-----------|
| **Default** | `$form-ink` border, transparent bg |
| **Hover** | `$terminal-amber` border appears |
| **Focus** | `$terminal-amber` border + subtle glow |
| **Checked** | `$terminal-amber` fill (NOT black) |
| **Disabled** | `$form-grey-light` text, no border change |

### Edit Mode Indicator
- When edit mode active: thin amber border around entire sheet
- Edit toggle button inverts (amber bg, black text)

---

## Visual Effects

### Texture (Subtle)
- Very subtle scan lines (existing - keep)
- No heavy paper texture (cleaner than zine aesthetic)
- Slight vignette (existing - reduce intensity)

### Transitions
```scss
$transition-quick: 0.1s ease;   // Hovers, micro-interactions
$transition-normal: 0.15s ease; // State changes
```

---

## Do / Don't

### DO
- Use monospace for everything
- Use amber for interactive/active states
- Use box-drawing for borders
- Keep it functional and readable
- Let the "reclaimed" feel come from small imperfections

### DON'T
- Use decorative fonts
- Use neon pink or cyberpunk cliches
- Add heavy textures or noise
- Make it illegible for "aesthetic"
- Forget this is a functional game aid

---

## Reference Sources

- [16colo.rs ANSI Archive](https://16colo.rs/) - Terminal aesthetic, limited palette
- [Samizdat](https://en.wikipedia.org/wiki/Samizdat) - Carbon copy, typewriter, underground
- [Brutalist Web Design](https://brutalistwebsites.com/) - Raw, functional, no decoration
- [Wang Zhi-Hong](https://wangzhihong.com/) - Minimalist typography as structure
