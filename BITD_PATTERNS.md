# Blades in the Dark Sheet Patterns & Tricks

Reference document for implementing DC,SB sheet based on the official BitD Roll20 sheet.

**Sources**:
- [Roll20 Official Sheet](https://github.com/Roll20/roll20-character-sheets/tree/master/Blades%20in%20the%20Dark) - Raw HTML/CSS (7,438 lines HTML, 4,746 lines CSS)
- [joesinghaus/Blades-in-the-Dark](https://github.com/joesinghaus/Blades-in-the-Dark) - Original author
- [joesinghaus/Blades-template](https://github.com/joesinghaus/Blades-template) - Pug/SCSS version for hacking

---

## File Structure (Official Roll20)

```
Blades in the Dark/
├── Assets/
│   ├── darkmode/              # Dark mode image variants
│   ├── rolltemplate/          # 34 roll template images
│   │   ├── rolltemplate-action.gif
│   │   ├── rolltemplate-fortune.jpg
│   │   └── rolltemplate-title-*.png  (Hunt, Study, etc.)
│   └── teeth/                 # 8 tooth/dot images
│       ├── shorttooth-grey.png / shorttooth-red.png
│       ├── stresstooth-black.png / stresstooth-white.png
│       ├── stresstooth-halfgrey.png / stresstooth-red.png
│       └── xptooth-red.png / xptooth-white.png
├── translations/              # Localization files
├── blades.html               # Main sheet + sheet workers
├── blades.css                # All styling
├── sheet.json                # Roll20 configuration
└── translation.json          # English translation keys
```

---

## 1. Action Dots: Checkbox "Fakeradio" Pattern

The BitD sheet uses **stacked checkboxes with incrementing values**, not radio buttons.

### Actual HTML Structure (from official sheet)
```html
<div class="action flex">
  <!-- Hidden formula for dice pool calculation -->
  <input type="hidden" name="attr_hunt_formula" value="..."/>
  <input type="hidden" name="attr_hunt_roll_mods" value=""/>

  <!-- Hidden zero-value checkbox (default state) -->
  <input class="hidden fakeradio" type="checkbox" name="attr_hunt" value="0" checked="checked"/>

  <!-- Visible dots: First dot before divider (marks attribute minimum) -->
  <input class="checkbox circlebox fakeradio" type="checkbox" name="attr_hunt" value="1"/><span></span>

  <!-- Divider separates "free" dot from trained dots -->
  <div class="divider"></div>

  <!-- Remaining 4 trainable dots -->
  <input class="checkbox circlebox fakeradio" type="checkbox" name="attr_hunt" value="2"/><span></span>
  <input class="checkbox circlebox fakeradio" type="checkbox" name="attr_hunt" value="3"/><span></span>
  <input class="checkbox circlebox fakeradio" type="checkbox" name="attr_hunt" value="4"/><span></span>
  <input class="checkbox circlebox fakeradio" type="checkbox" name="attr_hunt" value="5"/><span></span>

  <!-- Roll button -->
  <button class="rollbutton" type="roll" name="roll_Hunt" value="...">
    <span data-i18n="hunt"></span>
  </button>
</div>
```

### Why This Works
- All checkboxes share the same `name` attribute
- Roll20 treats highest checked value as the attribute value
- CSS `:checked ~ span` selector fills all FOLLOWING elements
- The "divider" separates the first dot (Blades +1 mechanic)

### CSS Pattern (Actual)
```css
/* Action dots: All dots start filled (red), unchecked ones become light */
.charsheet .checkbox.fakeradio + span {
    background: red;
}
/* When a fakeradio is checked, all FOLLOWING fakeradio spans become light */
.charsheet .action .fakeradio:checked ~ .fakeradio + span {
    background: var(--blades-lighter);
}
```

### Key Insight: "Inverse Fill"
They DON'T fill dots up TO the value. They:
1. Start with ALL dots filled (red/dark)
2. Make dots AFTER the checked one light/empty
3. This creates the visual of "N filled dots" without row-reverse

---

## 2. Stress/Trauma: Tooth Images with Radio Buttons

Uses **radio buttons** (not checkboxes) with custom background images.

### Actual HTML Structure
```html
<div class="stress2 blackborder flex">
  <!-- Zero state (hidden) -->
  <input class="tooth zero" type="radio" name="attr_stress" value="0" checked="checked"/><span></span>

  <!-- Standard 8 stress boxes -->
  <input class="tooth stresstooth" type="radio" name="attr_stress" value="1"/><span></span>
  <input class="tooth stresstooth" type="radio" name="attr_stress" value="2"/><span></span>
  <!-- ... values 3-8 ... -->

  <!-- Extra stress toggle (for expanded stress tracks) -->
  <input class="hidden extra-teeth" type="checkbox" name="attr_setting_extra_stress" value="0" checked="checked"/>
  <input class="tooth stresstooth" type="radio" name="attr_stress" value="9"/><span></span>
  <!-- ... expandable to 14 ... -->
</div>
```

### Trauma (Count + Conditions)
```html
<!-- Count tracker (0-5) -->
<div class="traumaholder flex">
  <input class="tooth zero" type="radio" name="attr_trauma" value="0" checked="checked"/><span></span>
  <input class="tooth regulartooth" type="radio" name="attr_trauma" value="1"/><span></span>
  <!-- ... values 2-5 ... -->
</div>

<!-- Condition checkboxes (separate attributes) -->
<div class="normal">
  <label class="text-button">
    <input type="checkbox" name="attr_trauma_cold" value="1"/>
    <span data-i18n="cold"></span>
  </label>
  <!-- ... haunted, obsessed, paranoid, reckless, soft, unstable, vicious ... -->
</div>
```

### CSS Pattern
```css
/* Default: unfilled (red outline) */
.charsheet .stresstooth[type=radio] + span {
    background-image: url(".../stresstooth-red.png");
}
/* When any tooth is checked, all following teeth become filled (white) */
.charsheet .tooth:checked ~ .stresstooth[type=radio] + span {
    background-image: url(".../stresstooth-white.png");
}

/* Same pattern for XP and short teeth */
.charsheet .xptooth + span {
    background-image: url(".../xptooth-red.png");
}
.charsheet .tooth:checked ~ .xptooth + span {
    background-image: url(".../xptooth-white.png");
}
```

### Visual Assets
```
teeth/
├── stresstooth-black.png    # Filled (checked)
├── stresstooth-white.png    # Empty (after checked)
├── stresstooth-red.png      # Empty (default)
├── stresstooth-halfgrey.png # Partial?
├── shorttooth-grey.png      # Trauma filled
├── shorttooth-red.png       # Trauma empty
├── xptooth-red.png          # XP empty
└── xptooth-white.png        # XP filled
```

### Key Insight: Same Sibling Pattern
Same as action dots - uses `:checked ~ sibling` to change appearance of elements AFTER the checked one.

---

## 3. Layout: CSS Grid

### Main Structure
```scss
.sheet-type-character {
  display: grid;
  grid: auto / 55% calc(45% - 5px);
  grid-gap: 10px 5px;
}

.sheet-left-column {
  display: grid;
  grid: auto / 1.1fr .9fr;  // Nested 2-column
  align-content: start;
}
```

### Container
```scss
.sheet-container {
  position: relative;
  min-width: 860px;
  max-width: 1190px;
}
```

---

## 4. Data-Driven Architecture

### Central data.json
All game content lives in one JSON file:

```json
{
  "playbooks": {
    "cutter": {
      "abilities": ["battleborn", "bodyguard", ...],
      "playbookitems": [
        {"name": "fine_hand_weapon", "boxes": 1},
        {"name": "fine_heavy_weapon", "boxes": 2}
      ],
      "friends": ["marlane", "chael", ...]
    }
  },
  "actions": {
    "insight": ["hunt", "study", "survey", "tinker"],
    "prowess": ["finesse", "prowl", "skirmish", "wreck"],
    "resolve": ["attune", "command", "consort", "sway"]
  },
  "items": [
    {"name": "a_blade_or_two", "boxes": 1},
    {"name": "throwing_knives", "boxes": 1}
  ]
}
```

### Pug Iteration
```pug
- const actionData = locals.actions
each actions, attribute in actionData
  .attribute
    each action in actions
      .action
        //- render action
```

---

## 5. Repeating Sections with Autogen Flag

### Pattern
```javascript
// Mark rows as auto-generated
setAttrs({
  [`repeating_abilities_${newRowId}_autogen`]: "1"
});

// Later: only remove autogen rows when rebuilding
getSectionIDs("repeating_abilities", ids => {
  const autogenRows = ids.filter(id =>
    v[`repeating_abilities_${id}_autogen`] === "1"
  );
  // Remove only autogen rows, preserve user-created
});
```

### Why This Matters
When playbook changes, system can:
1. Remove auto-generated abilities
2. Preserve user-added custom abilities
3. Fill new playbook abilities

---

## 6. Roll Formulas in Hidden Inputs

### Pattern
```pug
+hidden-input(`${action}_formula`)(value=zerodiceFormula)
```

### Sheet Worker Updates
```javascript
on("change:hunt change:study ...", () => {
  // Calculate resistance value
  const resistance = Math.max(hunt, study, survey, tinker);
  setAttrs({
    insight_formula: `${resistance}d6`,
    insight: resistance
  });
});
```

### Roll Button Uses Formula
```pug
+roll("insight", "{{dice=[[@{insight_formula}]]}}")
```

---

## 7. XP Boxes: Radio-Based Counter

```pug
+radio(`${attribute}_xp`)(value="0", checked).tooth.zero
each num in range(1,8)
  +radio(`${attribute}_xp`)(value=num).tooth.xptooth
```

Same sibling-fill pattern as stress.

---

## 8. Clocks: CSS-Only Pie Chart

Uses CSS gradients for progress indication:

```scss
@mixin clock($angle) {
  @if $angle == 0 {
    background: white;
  } @else if $angle == 360 {
    background: red;
  } @else if $angle < 180 {
    background: linear-gradient(90deg, white 50%, transparent 50%),
                linear-gradient(#{$angle + 90}deg, red 50%, transparent 50%);
  } @else {
    background: linear-gradient(#{$angle - 90}deg, red 50%, transparent 50%),
                linear-gradient(90deg, red 50%, transparent 50%);
  }
}
```

---

## 9. Claims: Grid-Based Territory Map

```pug
.claims-container
  each claim in crewData.claims
    +claimbox(claim.name, claim.x, claim.y)
```

Uses absolute positioning with CSS grid overlay.

---

## 10. Sheet Worker Tricks

### Auto-Fill Lower Checkboxes
```javascript
function handleBoxesFill(v, attr, max) {
  const value = parseInt(v[attr]) || 0;
  const updates = {};
  for (let i = 1; i <= max; i++) {
    updates[`${attr}_${i}`] = (i <= value) ? "1" : "0";
  }
  setAttrs(updates);
}
```

### Attribute from Max Action
```javascript
function calculateResistance(attribute, actions, v) {
  let max = 0;
  actions.forEach(action => {
    max = Math.max(max, parseInt(v[action]) || 0);
  });
  return max;
}
```

---

## Key Differences from Our Current Approach

| Aspect | Our Current | BitD Pattern |
|--------|------------|--------------|
| Action dots | Radio buttons + row-reverse | Checkboxes + "inverse fill" sibling |
| Fill logic | CSS row-reverse trick | All filled by default, unfill after checked |
| Input type | Radio buttons | Checkboxes (fakeradio class) |
| Data structure | Hardcoded in Pug | Embedded in sheet workers |
| Layout | Flexbox | CSS Grid (55%/45% columns) |
| Visual trackers | Circles/squares | Custom tooth PNG images |
| Repeating sections | Manual | Autogen-flagged |
| Roll formulas | Inline | Hidden inputs, updated by workers |

---

## Recommendations for DC,SB

### High Priority (Structural Changes)

1. **Switch to Checkbox "Fakeradio" Pattern**
   - Use checkboxes with incrementing values (0-4)
   - Hidden value="0" checkbox checked by default
   - "Inverse fill" CSS: all dots filled, unfill after checked
   - More reliable than row-reverse trick

2. **Switch to CSS Grid Layout**
   - Main: `grid: auto / 55% calc(45% - 5px)`
   - Left column: nested grid for attributes
   - Right column: nested grid for items/abilities

3. **Add Hidden Formula Inputs**
   - Store roll formulas in hidden inputs
   - Sheet workers update them when values change
   - Roll buttons reference the formula attribute

### Medium Priority (Visual Polish)

4. **Consider Custom Assets**
   - Create zine-styled tooth/box images
   - Or keep CSS-only for simplicity (our current approach works)

5. **Add Autogen Flags to Repeating Sections**
   - Track which rows were auto-generated
   - Allow safe rebuild when playbook changes

### Low Priority (Nice to Have)

6. **Create data.ts/json**
   - Centralize playbook data, items, etc.
   - Makes maintenance easier
   - But adds complexity to build

---

## Implementation Checklist

- [ ] Refactor action dots to checkbox fakeradio pattern
- [ ] Update CSS to use inverse-fill instead of row-reverse
- [ ] Switch main layout from flexbox to CSS grid
- [ ] Add hidden formula inputs for roll calculations
- [ ] Update sheet workers to calculate formulas
- [ ] Add autogen flags to repeating sections
- [ ] Test stress/trauma/XP trackers with new pattern

---

## Sources

- [Roll20 Official Sheet](https://github.com/Roll20/roll20-character-sheets/tree/master/Blades%20in%20the%20Dark) - Current official version
- [joesinghaus/Blades-in-the-Dark](https://github.com/joesinghaus/Blades-in-the-Dark) - Original author's repo
- [joesinghaus/Blades-template](https://github.com/joesinghaus/Blades-template) - Hackable Pug/SCSS version
