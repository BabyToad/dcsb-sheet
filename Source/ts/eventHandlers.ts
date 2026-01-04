// Dark City, Shining Babel - Sheet Worker Event Handlers
// Event bindings for sheet interactivity

// =============================================================================
// SHEET INITIALIZATION
// =============================================================================

on("sheet:opened", () => {
    initializeSheet();
});

// =============================================================================
// ATTRIBUTE CALCULATIONS - Trigger when actions change
// =============================================================================

// Acuity = max(hack, recon, scrutinize, tamper)
on("change:hack change:recon change:scrutinize change:tamper", () => {
    calculateAttributeRating('acuity');
});

// Grit = max(brawl, hunt, skulk, vandalize)
on("change:brawl change:hunt change:skulk change:vandalize", () => {
    calculateAttributeRating('grit');
});

// Resolve = max(consort, dominate, finesse, sway)
on("change:consort change:dominate change:finesse change:sway", () => {
    calculateAttributeRating('resolve');
});

// =============================================================================
// ACTION ROLL HANDLERS (12 total)
// =============================================================================

ACTIONS.forEach(action => {
    on(`clicked:roll_${action}`, () => {
        getAttrs([action, 'character_name'], v => {
            const dice = int(v[action]);
            const charName = v.character_name || 'Unknown';
            const actionName = action.charAt(0).toUpperCase() + action.slice(1);

            // Zero dice rule: roll 2d6, keep lowest
            const rollFormula = dice > 0 ? `${dice}d6kh1` : `2d6kl1`;

            startRoll(
                `&{template:dcsb-action} {{charname=${charName}}} {{title=${actionName}}} {{roll=[[${rollFormula}]]}}`,
                results => {
                    finishRoll(results.rollId, {});
                }
            );
        });
    });
});

// =============================================================================
// RESISTANCE ROLL HANDLERS (3 total)
// =============================================================================

ATTRIBUTE_NAMES.forEach(attr => {
    on(`clicked:roll_${attr}_resist`, () => {
        getAttrs([`${attr}_rating`, 'character_name'], v => {
            const dice = int(v[`${attr}_rating`]);
            const charName = v.character_name || 'Unknown';
            const attrName = attr.charAt(0).toUpperCase() + attr.slice(1);

            // Zero dice rule: roll 2d6, keep lowest
            const rollFormula = dice > 0 ? `${dice}d6kh1` : `2d6kl1`;

            startRoll(
                `&{template:dcsb-resistance} {{charname=${charName}}} {{attribute=${attrName}}} {{roll=[[${rollFormula}]]}}`,
                results => {
                    // Calculate stress from roll result (6 - highest die)
                    const rollResult = results.results.roll.result;
                    const stress = Math.max(0, 6 - rollResult);
                    finishRoll(results.rollId, { stress });
                }
            );
        });
    });
});

// =============================================================================
// LOAD TRACKING
// =============================================================================

// Load selection changes max
on("change:load", calculateLoad);

// Standard item checkboxes
Object.keys(STANDARD_ITEMS).forEach(item => {
    on(`change:${item}`, calculateLoad);
});

// Playbook items (repeating section)
on("change:repeating_items remove:repeating_items", calculateLoad);

// =============================================================================
// CYBERNETICS CAPACITY
// =============================================================================

on("change:repeating_cybernetics remove:repeating_cybernetics", calculateCyberCapacity);

// =============================================================================
// HEAT GAUGE (Crew Sheet)
// =============================================================================

on("change:score_heat_1 change:score_heat_2 change:score_heat_3 change:score_heat_4 change:score_heat_5 change:score_heat_6", calculateHeatDice);
