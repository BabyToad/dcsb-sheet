# Roll20 Sheet Update Roadmap

**Goal**: Update sheet from Mini Rulebook → The New Babel

Each phase is a discrete unit of work that can be tested and committed independently.

---

## Phase 1: Quick Wins (Low Risk)
*Simple additions/renames that don't affect existing functionality*

### 1.1 Add Babel to Heritage dropdown ✅
- **Files**: `Source/ts/constants.ts`, `Source/pug/character.pug`, `translation.json`
- **Change**: Add `'babel'` to `HERITAGES` array and dropdown
- **Test**: Open sheet, verify Babel appears in Heritage dropdown
- **Commit**: `feat(sheet): add Babel heritage option`

### 1.2 Rename L337 → Hacker in constants ✅
- **Files**: `Source/ts/constants.ts`, `Source/ts/playbookData.ts`, `Source/pug/character.pug`, `translation.json`
- **Change**: Replace `'l337'` with `'hacker'` everywhere (constants, data key, dropdown, i18n)
- **Test**: Playbook dropdown shows "Hacker" instead of "L337"
- **Commit**: `refactor(sheet): rename L337 playbook to Hacker`

---

## Phase 2: Terminology — Cybernetics → Augments ✅
*Search/replace across all files, no logic changes*

### 2.1 Update TypeScript types and constants ✅
- **Files**: `Source/ts/constants.ts`, `Source/ts/playbookData.ts`, `Source/ts/calculations.ts`
- **Changes**:
  - Rename `Cybernetic` interface → `Augment`
  - Rename `cybernetics` property → `augments` in PlaybookData
  - Rename `CYBER` constant → `AUGMENTS`
  - Rename `CYBERNETIC_TIERS` → `AUGMENT_TIERS`
  - Update all references in calculations.ts
- **Test**: Build succeeds, no TypeScript errors
- **Commit**: `refactor(sheet): rename Cybernetics to Augments in TypeScript`

### 2.2 Update Pug templates ✅
- **Files**: `Source/pug/character.pug`, `Source/pug/mixins.pug`
- **Changes**:
  - Rename section header "AUGMENTATION RECORD" (keep this, it still works)
  - Rename `repeating_cybernetics` → `repeating_augments`
  - Rename `cyber_*` attributes → `augment_*`
- **Test**: Sheet renders, augments section works
- **Commit**: `refactor(sheet): rename Cybernetics to Augments in templates`

### 2.3 Update SCSS styles ✅
- **Files**: `Source/_character.scss`, any other SCSS with `cyber` references
- **Changes**: Rename CSS classes/selectors from `cyber` → `augment`
- **Test**: Styles still apply correctly
- **Commit**: `refactor(sheet): rename Cybernetics to Augments in styles`

### 2.4 Update translation.json ✅
- **Files**: `translation.json`
- **Changes**: No changes needed - no cybernetics keys existed
- **Note**: CAPACITY key is generic, kept as-is

---

## Phase 3: Heat Gauge Update (6 → 8 segments) ✅
*Simple constant change with minor UI adjustment*

### 3.1 Update Heat Gauge constant ✅
- **Files**: `Source/ts/constants.ts`, `Source/ts/calculations.ts`
- **Change**: `HEAT_GAUGE.SEGMENTS: 6` → `8`, update comments
- **Commit**: `feat(sheet): update Heat Gauge from 6 to 8 segments`

### 3.2 Update Heat Gauge UI ✅
- **Files**: `Source/pug/mixins.pug`
- **Change**: Updated heat-gauge mixin from 6 to 8 segments
- **Note**: Combined with 3.1 in single commit

---

## Phase 4: Playbook Data Updates ✅
*Update all playbook-specific data to match The New Babel*

### 4.1 Rename L337 → Hacker ✅
- **Note**: Done in Phase 1.2

### 4.2 Update all playbook items and Augments ✅
- **Files**: `Source/ts/playbookData.ts`
- **Changes**: Updated all 6 playbooks with data from The New Babel
  - Removed "Your Old CCID" from all playbooks
  - Face: Renamed item, shifted augment tiers (3→T2, others shifted down)
  - Fixer: Renamed item, all T3 augments moved to T2
  - Hacker: New items (Chipsets, Surveillance), new T2 + T5 augments, renamed augment
  - MidNighter, Murk, Street Warrior: Removed CCID, augments unchanged
- **Commit**: `feat(sheet): update playbook data to match The New Babel`

### 4.3 Chipset system for Hacker
- **Note**: Represented as item entries "Specialty Chipsets (Choose 3)" and "Extra Chipsets (Choose 2 more)"
- **Future**: May need dedicated UI if players want to track which chipsets are chosen

---

## Phase 5: Friends & Rivals System ✅
*New feature — add playbook-specific contacts*

### 5.1 Add Friends data to playbookData.ts ✅
- **Files**: `Source/ts/playbookData.ts`
- **Changes**:
  - Add `friends` array to PlaybookData interface
  - Add friends list for each playbook from The New Babel
- **Commit**: `feat(sheet): add playbook Friends data`

### 5.2 Create Friends/Rivals UI section ✅
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Changes**:
  - Replace generic "Circles" section with new "Friends & Rivals" section
  - 5 fixed friend slots with up/down arrow relation selection
  - Display/edit modes following existing patterns
- **Commit**: `feat(sheet): add Friends & Rivals UI section`

### 5.3 Wire up Friends population on playbook change ✅
- **Files**: `Source/ts/calculations.ts`
- **Changes**:
  - `populateFriends()` sets friend_1 through friend_5 name/desc
  - `resetFriendRelations()` resets all to neutral on full reset
  - handlePlaybookChange() and resetToPlaybookDefaults() updated
- **Commit**: `feat(sheet): populate Friends on playbook change`

---

## Phase 6: Augment Maintenance System ✅
*Major system change — replace capacity cap with maintenance clocks*

### 6.1-6.4 Maintenance system implementation ✅
- **Changes**:
  - Remove `AUGMENTS.DEFAULT_MAX`, add `MAINTENANCE.CLOCK_SIZE` (4 ticks)
  - Replace `calculateAugmentCapacity` with `calculateAugmentMaintenance`
  - Calculate total ticks = sum of installed augment tiers
  - Calculate full clocks = floor(ticks / 4) = BC owed
  - UI shows: "MAINTENANCE: X ticks → Y clocks = Y BC owed"
- **Commit**: `feat(sheet): replace Augment capacity with maintenance system`

### 6.5 Add maintenance roll (optional)
- **Status**: Skipped for now - can add later if needed

---

## Phase 7: Deep Cuts Advancement System ✅
*Major system change — replace XP trackers with advancement clocks*

### 7.1-7.4 Advancement system implementation ✅
- **Changes**:
  - Remove attribute XP tracks (acuity/grit/resolve)
  - Remove playbook XP track (8-segment)
  - Add 4× 6-segment advancement clocks (adv_clock_1 through adv_clock_4)
  - Add advancement cost reference table
  - Keep XP trigger text with "mark when you do your XP trigger" hint
- **Commit**: `feat(sheet): replace XP trackers with Deep Cuts advancement clocks`

---

## Phase 8: Polish & Remaining Items ✅
*Final cleanup and any deferred items*

### 8.1 Update standard items if changed ✅
- **Status**: Complete - cross-checked with The New Babel

### 8.2 Update crew sheet if needed ✅
- **Status**: Complete - crew sheet reviewed and updated

### 8.3 Final testing pass ✅
- **Status**: Complete

### 8.4 Update documentation ✅
- **Status**: ROADMAP.md and CLAUDE.md updated with completion marks

### 8.5 Add detail fields for Heritage & Background ✅
- **Files**: `Source/pug/character.pug`, `Source/_inputs.scss`
- **Changes**:
  - Heritage detail input (e.g. "political dissident")
  - Background detail input (e.g. "hydroponics farmer")
  - Display shows detail in parentheses if filled
- **Commit**: `feat(sheet): add Heritage and Background detail fields`

---

## Dependency Graph

```
Phase 1 (Quick Wins)
    ↓
Phase 2 (Terminology) ←── Must complete before Phase 4-6
    ↓
Phase 3 (Heat Gauge) ←── Independent, can run parallel to Phase 4
    ↓
Phase 4 (Playbook Data) ←── Depends on Phase 2
    ↓
Phase 5 (Friends/Rivals) ←── Depends on Phase 4
    ↓
Phase 6 (Maintenance) ←── Depends on Phase 2
    ↓
Phase 7 (Advancement) ←── Independent of Phase 5-6
    ↓
Phase 8 (Polish) ✅
```

---

## 🎉 The New Babel Update Complete

All phases complete. Sheet is now fully aligned with The New Babel rulebook.

---

## Working Agreement

1. **One phase at a time** — Complete and commit before moving on
2. **Test after each step** — Verify in Roll20 sandbox before committing
3. **Atomic commits** — Each commit message listed above
4. **Reference The New Babel** — Don't edit it; it's the source of truth from Dylan's Google Doc
