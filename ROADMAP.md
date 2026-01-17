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

## Phase 3: Heat Gauge Update (6 → 8 segments)
*Simple constant change with minor UI adjustment*

### 3.1 Update Heat Gauge constant
- **Files**: `Source/ts/constants.ts`
- **Change**: `HEAT_GAUGE.SEGMENTS: 6` → `8`
- **Test**: Disengagement Roll calculation still works (rolls 8 - filled segments)
- **Commit**: `feat(sheet): update Heat Gauge to 8 segments`

### 3.2 Update Heat Gauge UI (if hardcoded)
- **Files**: `Source/pug/crew.pug` (check if segments are hardcoded or generated)
- **Change**: If hardcoded, add 2 more segment checkboxes
- **Test**: Crew sheet shows 8 Heat Gauge segments
- **Commit**: `feat(sheet): update Heat Gauge UI to 8 segments`

---

## Phase 4: Playbook Data Updates
*Update all playbook-specific data to match The New Babel*

### 4.1 Rename L337 → Hacker in playbookData.ts
- **Files**: `Source/ts/playbookData.ts`
- **Changes**:
  - Rename `l337` key → `hacker`
  - Update `title: "L337"` → `title: "Hacker"`
- **Test**: Selecting Hacker playbook populates correctly
- **Commit**: `refactor(sheet): rename L337 to Hacker in playbook data`

### 4.2 Update Hacker playbook items and Augments
- **Files**: `Source/ts/playbookData.ts`
- **Changes**: Update `hacker` entry with new items and Augments from The New Babel
  - New items: Fine Hacking Deck (2 load), Electro-Goggles, Stimulants, Specialty Chipsets, etc.
  - New Augments with updated tiers
- **Reference**: `../The New Babel.md` lines 281-322
- **Test**: Selecting Hacker populates correct items/Augments
- **Commit**: `feat(sheet): update Hacker playbook items and Augments`

### 4.3 Update all other playbook Augments
- **Files**: `Source/ts/playbookData.ts`
- **Changes**: Update Augment lists and tiers for:
  - Face (lines 213-246)
  - Fixer (lines 248-279)
  - MidNighter (lines 324-356)
  - Murk (lines 358-390)
  - Street Warrior (lines 392-424)
- **Test**: Each playbook populates correct Augments with correct tiers
- **Commit**: `feat(sheet): update Augment tiers for all playbooks`

### 4.4 Add Chipset system for Hacker
- **Files**: `Source/ts/playbookData.ts`, possibly new UI
- **Note**: Hacker has a unique "Specialty Chipsets" mechanic - may need special handling
- **Scope TBD**: Determine if this needs custom UI or just item entries
- **Commit**: `feat(sheet): add Hacker Chipset system`

---

## Phase 5: Friends & Rivals System
*New feature — add playbook-specific contacts*

### 5.1 Add Friends data to playbookData.ts
- **Files**: `Source/ts/playbookData.ts`
- **Changes**:
  - Add `friends` array to PlaybookData interface
  - Add friends list for each playbook from The New Babel
- **Example**:
  ```typescript
  friends: [
    { name: "Kala", description: "a Vice Dealer" },
    { name: "Yuda", description: "a Gang Leader" },
    // ...
  ]
  ```
- **Commit**: `feat(sheet): add playbook Friends data`

### 5.2 Create Friends/Rivals UI section
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Changes**:
  - Replace generic "Circles" section with new "Friends & Rivals" section
  - Display playbook's friends list (auto-populated on playbook select)
  - Add Friend/Rival selection (arrow up = friend, arrow down = rival)
- **Test**: Selecting playbook populates friends list, can mark friend/rival
- **Commit**: `feat(sheet): add Friends & Rivals UI section`

### 5.3 Wire up Friends population on playbook change
- **Files**: `Source/ts/calculations.ts`, `Source/ts/eventHandlers.ts`
- **Changes**: When playbook changes, populate friends section
- **Test**: Changing playbook updates friends list
- **Commit**: `feat(sheet): populate Friends on playbook change`

---

## Phase 6: Augment Maintenance System
*Major system change — replace capacity cap with maintenance clocks*

### 6.1 Remove capacity cap system
- **Files**: `Source/ts/constants.ts`, `Source/ts/calculations.ts`
- **Changes**:
  - Remove `CYBER.DEFAULT_MAX` / `AUGMENTS.DEFAULT_MAX`
  - Remove `cyber_max` / `augment_max` attribute
  - Remove `calculateCyberCapacity` function (or repurpose)
- **Test**: Sheet builds without capacity references
- **Commit**: `refactor(sheet): remove Augment capacity cap`

### 6.2 Add maintenance clock data model
- **Files**: `Source/ts/constants.ts`
- **Changes**:
  - Add `MAINTENANCE` constant with clock size (4 ticks)
  - Define maintenance clock calculation: sum of installed Augment tiers → 4-tick clocks
- **Commit**: `feat(sheet): add Augment maintenance constants`

### 6.3 Add maintenance clock UI
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Changes**:
  - Add maintenance clocks display in Augmentation Record section
  - Show: total ticks, number of 4-tick clocks, BC owed
- **Test**: UI displays maintenance clocks based on installed Augments
- **Commit**: `feat(sheet): add maintenance clock UI`

### 6.4 Wire up maintenance calculations
- **Files**: `Source/ts/calculations.ts`, `Source/ts/eventHandlers.ts`
- **Changes**:
  - Calculate total maintenance ticks from installed Augments
  - Calculate number of full 4-tick clocks (= BC owed)
  - Update on Augment install/uninstall and tier change
- **Test**: Installing Augments updates maintenance display correctly
- **Commit**: `feat(sheet): wire up maintenance clock calculations`

### 6.5 Add maintenance roll (optional)
- **Files**: `Source/ts/eventHandlers.ts`, `Source/pug/character.pug`
- **Changes**: Add button/roll for unpaid maintenance consequence
- **Reference**: The New Babel lines 79-86 for roll outcomes
- **Commit**: `feat(sheet): add maintenance failure roll`

---

## Phase 7: Deep Cuts Advancement System
*Major system change — replace XP trackers with advancement clocks*

### 7.1 Design advancement clock data model
- **Scope**: Define how to store 4× 6-segment clocks
- **Options**:
  - 4 separate attributes (`adv_clock_1` through `adv_clock_4`)
  - Single attribute tracking total ticks
- **Reference**: The New Babel lines 113-126 for advancement costs
- **Commit**: Design document / no code change

### 7.2 Remove old XP tracker UI
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Changes**: Remove playbook XP and attribute XP tracks
- **Commit**: `refactor(sheet): remove legacy XP tracker UI`

### 7.3 Add advancement clocks UI
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Changes**:
  - Add 4× 6-segment clock display
  - Add advancement cost reference table
- **Test**: Clocks display and can be filled
- **Commit**: `feat(sheet): add Deep Cuts advancement clocks UI`

### 7.4 Wire up advancement calculations
- **Files**: `Source/ts/calculations.ts`, `Source/ts/eventHandlers.ts`
- **Changes**: Handle clock filling/clearing
- **Test**: Filling clocks, clearing for advancement works
- **Commit**: `feat(sheet): wire up advancement clock logic`

---

## Phase 8: Polish & Remaining Items
*Final cleanup and any deferred items*

### 8.1 Update standard items if changed
- **Files**: `Source/ts/constants.ts`
- **Check**: Compare standard items against The New Babel lines 426-460
- **Commit**: `feat(sheet): update standard items list`

### 8.2 Update crew sheet if needed
- **Files**: `Source/pug/crew.pug`, `Source/ts/crewData.ts`
- **Check**: Any crew-specific changes in The New Babel
- **Commit**: As needed

### 8.3 Final testing pass
- Test all playbooks
- Test crew sheet
- Test all rolls
- Verify Heat Gauge + Disengagement Roll flow

### 8.4 Update documentation
- **Files**: `CLAUDE.md`, `README.md`
- **Changes**: Mark update complete, remove WIP notes
- **Commit**: `docs: mark New Babel update complete`

### 8.5 Add detail fields for Heritage & Background
- **Files**: `Source/pug/character.pug`, `Source/_character.scss`
- **Rationale**: Players want to add specifics like "Labor, hydroponics farmer" or "Syndicate, political dissident"
- **Changes**: Add optional text input next to each dropdown for freeform detail
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
Phase 8 (Polish)
```

---

## Working Agreement

1. **One phase at a time** — Complete and commit before moving on
2. **Test after each step** — Verify in Roll20 sandbox before committing
3. **Atomic commits** — Each commit message listed above
4. **Reference The New Babel** — Don't edit it; it's the source of truth from Dylan's Google Doc
