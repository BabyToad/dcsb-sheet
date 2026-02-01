# Changelog

All notable changes to the DC,SB Roll20 Character Sheet.

## [0.3.1] - 2026-02-01

### Territory Claims System Overhaul

Complete rebuild of the crew sheet claims system with proper accessibility states.

#### Added
- **Accessibility States** - Three visual states for claim cells:
  - **Held** (amber) - Territory you control
  - **Accessible** (normal) - Directly connected to held territory, can be claimed
  - **Locked** (grey) - Not adjacent to held territory, cannot be claimed yet
- **Click-to-Toggle Connections** - Connections between claims can now be toggled on/off
- **Accessibility Calculation** - Sheet worker calculates which claims are accessible based on direct adjacency to held claims

#### Changed
- **Grid Layout** - Added 6px gaps between claim cells for cleaner visual separation
- **Connection Display** - Connections now span the gaps between cells
- **Legend Updated** - Shows HELD / ACCESSIBLE / LOCKED / LAIR states

#### Technical
- Claims only accessible if directly connected to a held position (not through multiple hops)
- Lair always counts as held for accessibility calculations
- Event handlers trigger recalculation when claims or connections change

---

## [0.3.0] - 2025-02-01

### Typography Improvements

Significant readability improvements through systematic font size increases.

#### Changed
- **Type Scale +2px** - All font sizes increased by 2px for better readability
  - New scale: 10px / 11px / 12px / 13px / 14px / 16px / 18px / 22px
- **Typography Variables** - Added `$type-xxs` (10px) and `$type-sm-plus` (13px) to type system
- **Hardcoded Replacements** - Replaced 36 hardcoded font-size declarations with variables for maintainability

#### Technical
- Layout-locked sizes preserved: level-num (18px), level-label (7px), lifestyle-markers (7px)
- Roll template font sizes unchanged (already optimized for chat readability)

---

## [0.2.0] - 2025-01-17

### The New Babel Update

Major update aligning the sheet with The New Babel rulebook (replacing Mini Rulebook).

#### Added
- **Custom Clocks** - Repeating section for progress clocks (4, 6, 8, 10, or 12 segments) on both Character and Crew sheets
- **Maintenance System** - Replaces Augment capacity cap; visual gauge showing BC owed with fortune roll for unpaid maintenance
- **Deep Cuts Advancement** - Four 6-segment clocks replace XP trackers for character advancement
- **Friends & Rivals** - Playbook-specific contacts section with Friend/Rival toggle, auto-populated on playbook selection
- **Heritage/Background Details** - New text fields for expanded character backstory
- **Babel Heritage** - Added to heritage dropdown options
- **Heat Gauge** - Expanded from 6 to 8 segments per New Babel rules

#### Changed
- **Cybernetics → Augments** - Complete terminology rename throughout sheet
- **L337 → Hacker** - Playbook renamed with updated items and abilities
- **Playbook Data** - Updated all playbook items, Augments, and tier assignments per New Babel
- **Standard Items** - Cross-checked and updated to match rulebook
- **Crew Sheet Sections** - Reorganized and renumbered for Clocks section
- **Advancement Costs** - Updated character sheet to show correct costs
- **Equipment Load** - Boxes now visually indicate load amount directly

#### Fixed
- Advancement clocks now fill left-to-right (forward fill pattern)
- Heritage/Background details display on separate row
- Crew upgrade names display in correct color (black)

### Visual Improvements
- **ASCII Art Title Banner** - Redesigned with CSS frame, block letters "DC,SB"
- **Roll Modifier System** - Position dice modifier (-1 to +5) applies to all rolls
- Healing clock converted to linear gauge for consistency

---

## [0.1.0] - 2024-12-XX

### Initial Release

First complete implementation of the DC,SB character sheet, built against Mini Rulebook.

- Character sheet with all 6 playbooks
- Crew sheet with all 4 crew types
- Full roll system (Action, Resistance, Fortune, Vice)
- Stress/Trauma tracking
- Cybernetics system with capacity
- Load tracking
- Cohort management
- Claims tracking
