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
            (dice, v, context) => {
                const charName = v.character_name || 'Unknown';
                const actionName = capitalize(action);
                const rollFormula = buildRollFormula(dice);

                // Build position and effect display (capitalize first letter)
                const posDisplay = context.position.charAt(0).toUpperCase() + context.position.slice(1);
                const effDisplay = context.effect.charAt(0).toUpperCase() + context.effect.slice(1);

                // Build notes section with modifier if present
                const notesSection = context.modNotes ? ` {{notes=${context.modNotes}}}` : '';

                startRoll(
                    `&{template:${ROLL_TEMPLATES.ACTION}} {{charname=${charName}}} {{title=${actionName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{position=${posDisplay}}} {{effect=${effDisplay}}}${notesSection}`,
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
            (dice, v, context) => {
                const charName = v.character_name || 'Unknown';
                const attrName = capitalize(attr);
                const rollFormula = buildRollFormula(dice);
                const notesSection = context.modNotes ? ` {{notes=${context.modNotes}}}` : '';

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

// Standard item load checkboxes (item_knife_1, item_large_weapon_1, item_large_weapon_2, etc.)
STANDARD_ITEM_LOAD_ATTRS.forEach(attr => {
    on(`change:${attr}`, calculateLoad);
});

// Playbook items (repeating section) - load boxes: item_load_1, item_load_2
on("change:repeating_items:item_load_1 change:repeating_items:item_load_2 remove:repeating_items", calculateLoad);

// =============================================================================
// AUGMENT MAINTENANCE
// =============================================================================

on("change:repeating_augments remove:repeating_augments", calculateAugmentMaintenance);

// Maintenance failure roll (when you can't pay BC owed)
on("clicked:roll_maintenance", () => {
    getAttrs(['maintenance_clocks', 'character_name'], v => {
        const clocks = int(v.maintenance_clocks);
        const charName = v.character_name || 'Unknown';

        // No roll needed if no clocks owed
        if (clocks <= 0) {
            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${charName}}} {{title=Maintenance}} {{roll=[[0d6]]}} {{label=NO MAINTENANCE DUE}} {{notes=You have no unpaid maintenance clocks.}}`,
                results => finishRoll(results.rollId, {})
            );
            return;
        }

        // Roll Xd6 take LOWEST where X = unpaid maintenance clocks
        const rollFormula = `${clocks}d${DICE.SIZE}${DICE.KEEP_LOWEST}`;
        const notes = 'Crit: Free next downtime. 6: Still working. 4-5: YOU choose augments to disable. 1-3: GM secretly chooses failures.';

        startRoll(
            `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${charName}}} {{title=Maintenance Failure (${clocks} unpaid)}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
            results => {
                const diceArray = results.results.roll.dice;
                const rollResult = results.results.roll.result;
                const crit = isCrit(diceArray);
                const label = getMaintenanceLabel(rollResult, crit);
                finishRoll(results.rollId, { label });
            }
        );
    });
});

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
        (dice, v, context) => {
            const crewName = v.crew_name || 'Crew';
            const rollFormula = buildRollFormula(dice);

            // Combine dice modifier with existing notes
            let notes = '1-3: 2 entanglements AND -2 coin. 4-5: -2 coin OR 2 entanglements. 6+: Clean getaway.';
            if (context.modNotes) notes = `${context.modNotes} | ${notes}`;

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
// ENGAGEMENT ROLL (Crew Sheet)
// =============================================================================

on("clicked:engagement_roll", () => {
    rollWithModifier(
        ['crew_name'],
        () => 0,  // Base dice = 0, relies on modifier
        (dice, v, context) => {
            const crewName = v.crew_name || 'Crew';
            const rollFormula = buildRollFormula(dice);

            // Combine dice modifier with existing notes
            let notes = '1-3: Bad start. 4-5: Risky start. 6: Controlled start. Crit: Controlled + edge.';
            if (context.modNotes) notes = `${context.modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${crewName}}} {{title=Engagement}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const rollResult = results.results.roll.result;
                    const crit = isCrit(diceArray);
                    const label = getEngagementLabel(rollResult, crit);
                    finishRoll(results.rollId, { label });
                }
            );
        }
    );
});

// =============================================================================
// FORTUNE ROLL (Header - generic fortune roll with position/effect)
// =============================================================================

on("clicked:fortune_roll", () => {
    rollWithModifier(
        ['character_name', 'crew_name'],
        () => 0,  // Base dice = 0, relies on modifier
        (dice, v, context) => {
            const name = v.character_name || v.crew_name || 'Unknown';
            const rollFormula = buildRollFormula(dice);

            // Build position and effect display
            const posDisplay = context.position.charAt(0).toUpperCase() + context.position.slice(1);
            const effDisplay = context.effect.charAt(0).toUpperCase() + context.effect.slice(1);

            // Build notes section
            let notes = '1-3: Bad outcome. 4-5: Mixed outcome. 6: Good outcome. Crit: Exceptional.';
            if (context.modNotes) notes = `${context.modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.FORTUNE}} {{charname=${name}}} {{title=Fortune}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{position=${posDisplay}}} {{effect=${effDisplay}}} {{notes=${notes}}}`,
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
    // Note: calculateClaimAccessibility will also be triggered by connection change events
    // when populateCrewClaimConnections sets the connection checkboxes
});

// =============================================================================
// CLAIM ACCESSIBILITY CALCULATION
// =============================================================================

// Recalculate when any claim is held/unheld
on("change:claim_1_held change:claim_2_held change:claim_3_held change:claim_4_held change:claim_5_held " +
   "change:claim_6_held change:claim_7_held change:claim_9_held change:claim_10_held " +
   "change:claim_11_held change:claim_12_held change:claim_13_held change:claim_14_held change:claim_15_held", () => {
    calculateClaimAccessibility();
});

// Recalculate when any connection changes
on("change:claim_1_conn_right change:claim_1_conn_bottom " +
   "change:claim_2_conn_right change:claim_2_conn_bottom " +
   "change:claim_3_conn_right change:claim_3_conn_bottom " +
   "change:claim_4_conn_right change:claim_4_conn_bottom " +
   "change:claim_5_conn_bottom " +
   "change:claim_6_conn_right change:claim_6_conn_bottom " +
   "change:claim_7_conn_right change:claim_7_conn_bottom " +
   "change:claim_8_conn_right change:claim_8_conn_bottom " +
   "change:claim_9_conn_right change:claim_9_conn_bottom " +
   "change:claim_10_conn_bottom " +
   "change:claim_11_conn_right " +
   "change:claim_12_conn_right " +
   "change:claim_13_conn_right " +
   "change:claim_14_conn_right", () => {
    calculateClaimAccessibility();
});

// =============================================================================
// FACTION POPULATION (Factions Tab)
// =============================================================================

on("clicked:populate_factions", () => {
    populateDefaultFactions();
});

on("clicked:clear_factions", () => {
    clearAllFactions();
});

// =============================================================================
// INDULGE VICE ROLL
// =============================================================================

on("clicked:indulge_vice", () => {
    rollWithModifier(
        ['acuity_rating', 'grit_rating', 'resolve_rating', 'character_name', 'vice_type', 'stress'],
        v => {
            const acuity = int(v.acuity_rating);
            const grit = int(v.grit_rating);
            const resolve = int(v.resolve_rating);
            // Roll lowest attribute (BitD rules)
            return Math.min(acuity, grit, resolve);
        },
        (dice, v, context) => {
            const charName = v.character_name || 'Unknown';
            const currentStress = int(v.stress);
            const rollFormula = buildRollFormula(dice);

            // Combine dice modifier with existing notes
            let notes = `Clear stress equal to highest die (current: ${currentStress}). Overindulge if roll > stress.`;
            if (context.modNotes) notes = `${context.modNotes} | ${notes}`;

            startRoll(
                `&{template:${ROLL_TEMPLATES.VICE}} {{charname=${charName}}} {{roll=[[${rollFormula}]]}} {{label=[[0]]}} {{notes=${notes}}}`,
                results => {
                    const diceArray = results.results.roll.dice;
                    const highestDie = Math.max(...diceArray);
                    const crit = isCrit(diceArray);
                    const label = getViceLabel(highestDie, currentStress, crit);
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
// CUSTOM CLOCKS - Size Change Handlers
// =============================================================================

// Character clocks - update visibility flags when size changes
on("change:repeating_clocks:clock_size", (eventInfo) => {
    const size = parseInt(eventInfo.newValue) || 6;

    // Get the repeating row prefix from the source attribute
    // e.g., "repeating_clocks_-ABC123_clock_size" -> "repeating_clocks_-ABC123"
    const match = eventInfo.sourceAttribute.match(/^(repeating_clocks_[^_]+)_/);
    if (!match) return;
    const prefix = match[1];

    setAttrs({
        [`${prefix}_clock_show_5_6`]: size >= 6 ? "1" : "0",
        [`${prefix}_clock_show_7_8`]: size >= 8 ? "1" : "0",
        [`${prefix}_clock_show_9_10`]: size >= 10 ? "1" : "0",
        [`${prefix}_clock_show_11_12`]: size >= 12 ? "1" : "0"
    });
});

// Crew clocks - update visibility flags when size changes
on("change:repeating_crewclocks:clock_size", (eventInfo) => {
    const size = parseInt(eventInfo.newValue) || 6;

    // Get the repeating row prefix from the source attribute
    const match = eventInfo.sourceAttribute.match(/^(repeating_crewclocks_[^_]+)_/);
    if (!match) return;
    const prefix = match[1];

    setAttrs({
        [`${prefix}_clock_show_5_6`]: size >= 6 ? "1" : "0",
        [`${prefix}_clock_show_7_8`]: size >= 8 ? "1" : "0",
        [`${prefix}_clock_show_9_10`]: size >= 10 ? "1" : "0",
        [`${prefix}_clock_show_11_12`]: size >= 12 ? "1" : "0"
    });
});

// =============================================================================
// HEALING FORTUNE ROLL
// =============================================================================

on("clicked:roll_healing", () => {
    rollWithModifier(
        ['character_name'],
        () => 1,  // Base healing roll is 1d
        (dice, v, context) => {
            const charName = v.character_name || 'Unknown';
            const rollFormula = buildRollFormula(dice);

            // Combine dice modifier with existing notes
            let notes = '1-3: 1 tick, 4-5: 2 ticks, 6: 3 ticks, Crit: 5 ticks. Fill clock to heal 1 harm level.';
            if (context.modNotes) notes = `${context.modNotes} | ${notes}`;

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
