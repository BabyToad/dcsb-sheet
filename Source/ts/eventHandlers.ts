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
        rollWithModifier(
            [action, 'character_name'],
            v => int(v[action]),
            (dice, v, modNotes) => {
                const charName = v.character_name || 'Unknown';
                const actionName = capitalize(action);
                const rollFormula = buildRollFormula(dice);
                const notesSection = modNotes ? ` {{notes=${modNotes}}}` : '';

                startRoll(
                    `&{template:${ROLL_TEMPLATES.ACTION}} {{charname=${charName}}} {{title=${actionName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}}${notesSection}`,
                    results => {
                        const diceArray = results.results.roll.dice;
                        const rollResult = results.results.roll.result;
                        const crit = isCrit(diceArray);
                        const label = getActionLabel(rollResult, crit);
                        finishRoll(results.rollId, { label });
                    }
                );
            }
        );
    });
});

// =============================================================================
// RESISTANCE ROLL HANDLERS (3 total)
// =============================================================================

ATTRIBUTE_NAMES.forEach(attr => {
    on(`clicked:roll_${attr}_resist`, () => {
        rollWithModifier(
            [`${attr}_rating`, 'character_name'],
            v => int(v[`${attr}_rating`]),
            (dice, v, modNotes) => {
                const charName = v.character_name || 'Unknown';
                const attrName = capitalize(attr);
                const rollFormula = buildRollFormula(dice);
                const notesSection = modNotes ? ` {{notes=${modNotes}}}` : '';

                startRoll(
                    `&{template:${ROLL_TEMPLATES.RESISTANCE}} {{charname=${charName}}} {{attribute=${attrName}}} {{roll=[[${rollFormula}]]}} {{stressmsg=[[0]]}}${notesSection}`,
                    results => {
                        const diceArray = results.results.roll.dice;
                        const rollResult = results.results.roll.result;
                        const crit = isCrit(diceArray);
                        const stressmsg = getStressMessage(rollResult, crit);
                        finishRoll(results.rollId, { stressmsg });
                    }
                );
            }
        );
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
// AUGMENT MAINTENANCE
// =============================================================================

on("change:repeating_augments remove:repeating_augments", calculateAugmentMaintenance);

// =============================================================================
// HEAT GAUGE (Crew Sheet)
// =============================================================================

on("change:score_heat", calculateHeatDice);

// =============================================================================
// DISENGAGEMENT ROLL (Crew Sheet)
// =============================================================================

on("clicked:disengage_roll", () => {
    rollWithModifier(
        ['score_heat', 'crew_name'],
        v => HEAT_GAUGE.SEGMENTS - int(v.score_heat),
        (dice, v, modNotes) => {
            const crewName = v.crew_name || 'Crew';
            const rollFormula = buildRollFormula(dice);

            // Combine position modifier with existing notes
            let notes = '1-3: 2 entanglements AND -2 coin. 4-5: -2 coin OR 2 entanglements. 6+: Clean getaway.';
            if (modNotes) notes = `${modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${crewName}}} {{title=Disengagement}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const rollResult = results.results.roll.result;
                    const crit = isCrit(diceArray);
                    const label = getDisengageLabel(rollResult, crit);
                    finishRoll(results.rollId, { label });
                }
            );
        }
    );
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
    rollWithModifier(
        ['acuity_rating', 'grit_rating', 'resolve_rating', 'character_name', 'vice_type'],
        v => {
            const acuity = int(v.acuity_rating);
            const grit = int(v.grit_rating);
            const resolve = int(v.resolve_rating);
            // Roll lowest attribute (BitD rules)
            return Math.min(acuity, grit, resolve);
        },
        (dice, v, modNotes) => {
            const charName = v.character_name || 'Unknown';
            const rollFormula = buildRollFormula(dice);

            // Combine position modifier with existing notes
            let notes = 'Clear stress equal to highest die. 6+ may overindulge.';
            if (modNotes) notes = `${modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.VICE}} {{charname=${charName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const crit = isCrit(diceArray);
                    const label = getViceLabel(crit);
                    finishRoll(results.rollId, { label });
                }
            );
        }
    );
});

// =============================================================================
// COHORT ROLL (Repeating Section)
// Gang: Tier dice, Expert: Tier+1 dice, Elite: +1d, Harm: -1d per level
// =============================================================================

on("clicked:repeating_cohorts:cohortroll", () => {
    getAttrs([
        'crew_tier',
        'crew_name',
        'repeating_cohorts_cohort_name',
        'repeating_cohorts_cohort_type',
        'repeating_cohorts_cohort_elite',
        'repeating_cohorts_cohort_harm',
        'roll_modifier'
    ], v => {
        const tier = int(v.crew_tier);
        const crewName = v.crew_name || 'Crew';
        const cohortName = v.repeating_cohorts_cohort_name || 'Cohort';
        const cohortType = v.repeating_cohorts_cohort_type || 'gang';
        const isElite = v.repeating_cohorts_cohort_elite === '1';
        const harm = int(v.repeating_cohorts_cohort_harm);
        const rollMod = int(v.roll_modifier);

        // Reset modifier immediately
        setAttrs({ roll_modifier: '0' }, { silent: true });

        // Check if cohort can act (broken=3, dead=4)
        if (harm >= 3) {
            const harmLabel = harm >= 4 ? 'DEAD' : 'BROKEN';
            const harmNote = harm >= 4 ? 'Cohort is dead.' : 'Cohort is broken and cannot act.';
            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${crewName}}} {{title=${cohortName}}} {{roll=[[0d6]]}} {{label=${harmLabel}}} {{notes=${harmNote}}}`,
                results => finishRoll(results.rollId, {})
            );
            return;
        }

        // Calculate dice pool
        // Gang: Tier, Expert: Tier+1, Elite: +1d, Harm: -1d per level, Position modifier
        let dice = tier;
        if (cohortType === 'expert') dice += 1;
        if (isElite) dice += 1;
        dice -= harm;
        dice += rollMod;

        // Build notes showing modifiers
        const mods: string[] = [];
        if (rollMod > 0) mods.push(`+${rollMod}d Position`);
        if (rollMod < 0) mods.push(`${rollMod}d Position`);
        mods.push(`Tier ${tier}`);
        if (cohortType === 'expert') mods.push('+1d Expert');
        if (isElite) mods.push('+1d Elite');
        if (harm === 1) mods.push('-1d Weak');
        if (harm === 2) mods.push('-2d Impaired');

        const rollFormula = buildRollFormula(dice);
        const typeLabel = cohortType === 'expert' ? 'Expert' : 'Gang';

        startRoll(
            `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${crewName}}} {{title=${cohortName} (${typeLabel})}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${mods.join(', ')}}}`,
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

// =============================================================================
// HEALING FORTUNE ROLL
// =============================================================================

on("clicked:roll_healing", () => {
    rollWithModifier(
        ['character_name'],
        () => 1,  // Base healing roll is 1d
        (dice, v, modNotes) => {
            const charName = v.character_name || 'Unknown';
            const rollFormula = buildRollFormula(dice);

            // Combine position modifier with existing notes
            let notes = '1-3: 1 tick, 4-5: 2 ticks, 6: 3 ticks, Crit: 5 ticks. Fill clock to heal 1 harm level.';
            if (modNotes) notes = `${modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${charName}}} {{title=Recovery}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const rollResult = results.results.roll.result;
                    const crit = isCrit(diceArray);
                    const label = getFortuneLabel(rollResult, crit);
                    finishRoll(results.rollId, { label });
                }
            );
        }
    );
});
