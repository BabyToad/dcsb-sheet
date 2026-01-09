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
            const actionName = capitalize(action);
            const rollFormula = buildRollFormula(dice);

            startRoll(
                `&{template:${ROLL_TEMPLATES.ACTION}} {{charname=${charName}}} {{title=${actionName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const rollResult = results.results.roll.result;
                    const crit = isCrit(diceArray);
                    const label = getActionLabel(rollResult, crit);
                    finishRoll(results.rollId, { label });
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
            const attrName = capitalize(attr);
            const rollFormula = buildRollFormula(dice);

            startRoll(
                `&{template:${ROLL_TEMPLATES.RESISTANCE}} {{charname=${charName}}} {{attribute=${attrName}}} {{roll=[[${rollFormula}]]}} {{stressmsg=[[0]]}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const rollResult = results.results.roll.result;
                    const crit = isCrit(diceArray);
                    const stressmsg = getStressMessage(rollResult, crit);
                    finishRoll(results.rollId, { stressmsg });
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

on("change:score_heat", calculateHeatDice);

// =============================================================================
// DISENGAGEMENT ROLL (Crew Sheet)
// =============================================================================

on("clicked:disengage_roll", () => {
    getAttrs(['score_heat', 'crew_name'], v => {
        const filled = int(v.score_heat);
        const dice = HEAT_GAUGE.SEGMENTS - filled;
        const crewName = v.crew_name || 'Crew';
        const rollFormula = buildRollFormula(dice);

        startRoll(
            `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${crewName}}} {{title=Disengagement}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=1-3: 2 entanglements AND -2 coin. 4-5: -2 coin OR 2 entanglements. 6+: Clean getaway.}}`,
            results => {
                const diceArray = results.results.roll.dice;
                const rollResult = results.results.roll.result;
                const crit = isCrit(diceArray);
                const label = getDisengageLabel(rollResult, crit);
                finishRoll(results.rollId, { label });
            }
        );
    });
});

// =============================================================================
// PLAYBOOK SELECTION
// =============================================================================

on("change:playbook", eventInfo => {
    const newPlaybook = eventInfo.newValue as string;
    handlePlaybookChange(newPlaybook);
});

// Reset to Playbook Defaults button
on("clicked:reset_to_playbook", () => {
    resetToPlaybookDefaults();
});

// =============================================================================
// CREW TYPE SELECTION
// =============================================================================

on("change:crew_type", eventInfo => {
    const newCrewType = eventInfo.newValue as string;
    handleCrewTypeChange(newCrewType);
});

// =============================================================================
// INDULGE VICE ROLL
// =============================================================================

on("clicked:indulge_vice", () => {
    getAttrs(['acuity_rating', 'grit_rating', 'resolve_rating', 'character_name', 'vice_type'], v => {
        const acuity = int(v.acuity_rating);
        const grit = int(v.grit_rating);
        const resolve = int(v.resolve_rating);
        const charName = v.character_name || 'Unknown';

        // Roll lowest attribute (BitD rules)
        const lowestRating = Math.min(acuity, grit, resolve);
        const rollFormula = buildRollFormula(lowestRating);

        startRoll(
            `&{template:${ROLL_TEMPLATES.VICE}} {{charname=${charName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=Clear stress equal to highest die. 6+ may overindulge.}}`,
            results => {
                const diceArray = results.results.roll.dice;
                const crit = isCrit(diceArray);
                const label = getViceLabel(crit);
                finishRoll(results.rollId, { label });
            }
        );
    });
});

// =============================================================================
// HEALING FORTUNE ROLL
// =============================================================================

on("clicked:roll_healing", () => {
    getAttrs(['character_name'], v => {
        const charName = v.character_name || 'Unknown';
        // Recovery is a fortune roll - typically 1d (can be modified by abilities)
        const rollFormula = buildRollFormula(1);

        startRoll(
            `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${charName}}} {{title=Recovery}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=1-3: 1 tick, 4-5: 2 ticks, 6: 3 ticks, Crit: 5 ticks. Fill clock to heal 1 harm level.}}`,
            results => {
                const diceArray = results.results.roll.dice;
                const rollResult = results.results.roll.result;
                const crit = isCrit(diceArray);
                const label = getFortuneLabel(rollResult, crit);
                finishRoll(results.rollId, { label });
            }
        );
    });
});
