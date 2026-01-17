/// <reference path="playbookData.ts" />
/// <reference path="crewData.ts" />
/// <reference path="constants.ts" />
// Dark City, Shining Babel - Sheet Worker Calculations
// Auto-calculation functions for derived values

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Parse integer with default value
 */
const int = (val: string | undefined, def: number = 0): number =>
    parseInt(val || '') || def;

/**
 * Count sixes in a dice roll result
 * Roll20 dice array is plain numbers: [3, 6, 2, 6] per the wiki
 * @param dice - Array of die results from Roll20
 * @returns Number of 6s rolled
 */
const countSixes = (dice: number[]): number =>
    dice.filter(d => d === DICE.SIZE).length;

/**
 * Check if roll is a critical (2+ sixes)
 * @param dice - Array of die results from Roll20
 * @returns true if critical, false otherwise
 */
const isCrit = (dice: number[]): boolean =>
    countSixes(dice) >= 2;

/**
 * Get action roll label with typography emphasis for crits
 */
const getActionLabel = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !!';
    if (result >= 6) return 'SUCCESS';
    if (result >= 4) return 'PARTIAL';
    return 'FAILURE';
};

/**
 * Get fortune roll label with typography emphasis for crits
 */
const getFortuneLabel = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !!';
    if (result >= 6) return 'BEST OUTCOME';
    if (result >= 4) return 'MIXED RESULT';
    return 'POOR OUTCOME';
};

/**
 * Get resistance roll stress message
 */
const getStressMessage = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !! Clear 1 stress';
    if (result >= 6) return 'No stress (rolled 6)';
    const stress = 6 - result;
    return `Take ${stress} stress`;
};

/**
 * Get vice roll label
 */
const getViceLabel = (crit: boolean): string => {
    return crit ? '!! CRITICAL !!' : 'CLEAR STRESS';
};

/**
 * Get disengagement roll label
 * 1-3: Bad (2 entanglements AND -2 coin)
 * 4-5: Mixed (choose one penalty)
 * 6: Clean getaway
 * Crit: Perfect escape
 */
const getDisengageLabel = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !! Perfect escape';
    if (result >= 6) return 'CLEAN GETAWAY';
    if (result >= 4) return 'MIXED - Choose one penalty';
    return 'BAD - Both penalties';
};

/**
 * Execute a roll with the current position dice modifier applied, then reset modifier to 0
 * @param baseAttrNames - Attributes needed for the roll (excluding roll_modifier)
 * @param getDiceCount - Function to calculate base dice from attributes
 * @param rollFn - Function that performs the roll given (finalDice, attrs, modNotes)
 */
const rollWithModifier = (
    baseAttrNames: string[],
    getDiceCount: (v: Record<string, string>) => number,
    rollFn: (dice: number, v: Record<string, string>, modNotes: string) => void
): void => {
    getAttrs([...baseAttrNames, 'roll_modifier'], v => {
        const baseDice = getDiceCount(v);
        const mod = int(v.roll_modifier);
        const finalDice = baseDice + mod;

        // Build modifier note for display
        let modNotes = '';
        if (mod > 0) modNotes = `+${mod}d Position`;
        else if (mod < 0) modNotes = `${mod}d Position`;

        // Reset modifier to 0 for next roll
        setAttrs({ roll_modifier: '0' }, { silent: true });

        rollFn(finalDice, v, modNotes);
    });
};

/**
 * Set attributes only if they've changed (reduces API calls)
 */
const mySetAttrs = (
    setting: {[key: string]: AttributeContent},
    v: {[key: string]: string},
    options?: {silent?: boolean},
    callback?: () => void
): void => {
    const finalSetting: {[key: string]: AttributeContent} = {};
    for (const key in setting) {
        if (String(v[key]) !== String(setting[key])) {
            finalSetting[key] = setting[key];
        }
    }
    if (Object.keys(finalSetting).length > 0) {
        setAttrs(finalSetting, options, callback);
    } else if (callback) {
        callback();
    }
};

// =============================================================================
// PLAYBOOK POPULATION FUNCTIONS
// =============================================================================

/**
 * Set starting action dots for a playbook (only if currently 0)
 */
const setStartingActions = (actions: { [action: string]: number }) => {
    const actionNames = Object.keys(actions);
    getAttrs(actionNames, v => {
        const updates: { [key: string]: number } = {};
        for (const [action, dots] of Object.entries(actions)) {
            // Only set if action is currently 0 or undefined
            if (!v[action] || parseInt(v[action]) === 0) {
                updates[action] = dots;
            }
        }
        if (Object.keys(updates).length > 0) {
            setAttrs(updates);
        }
    });
};

/**
 * Clear auto-generated rows and populate new ones
 * Uses "autogen" flag to distinguish from user-created rows
 */
const clearAndPopulateRepeatingSection = <T>(
    section: string,
    items: T[],
    formatter: (item: T, rowId: string) => { [key: string]: AttributeContent }
) => {
    getSectionIDs(`repeating_${section}`, ids => {
        // Get all autogen flags
        const autogenAttrs = ids.map(id => `repeating_${section}_${id}_autogen`);
        getAttrs(autogenAttrs, v => {
            // Remove only auto-generated rows
            ids.forEach(id => {
                if (v[`repeating_${section}_${id}_autogen`] === "1") {
                    removeRepeatingRow(`repeating_${section}_${id}`);
                }
            });

            // Add new items with autogen flag
            items.forEach(item => {
                const rowId = generateRowID();
                const attrs = formatter(item, rowId);
                attrs[`repeating_${section}_${rowId}_autogen`] = "1";
                setAttrs(attrs);
            });
        });
    });
};

/**
 * Format a playbook item for the repeating_items section
 */
const formatPlaybookItem = (
    item: { name: string; load: number; special?: boolean },
    rowId: string
): { [key: string]: AttributeContent } => {
    const name = item.special ? `*${item.name}*` : item.name;
    return {
        [`repeating_items_${rowId}_item_name`]: name,
        [`repeating_items_${rowId}_item_load`]: item.load,
        [`repeating_items_${rowId}_item_carried`]: "0"
    };
};

/**
 * Format an augment for the repeating section
 */
const formatAugment = (
    augment: { tier: number; name: string; description: string },
    rowId: string
): { [key: string]: AttributeContent } => {
    return {
        [`repeating_augments_${rowId}_augment_tier`]: augment.tier.toString(),
        [`repeating_augments_${rowId}_augment_name`]: augment.name,
        [`repeating_augments_${rowId}_augment_desc`]: augment.description
    };
};

/**
 * Populate friend slots from playbook data
 * Friends are fixed attributes (friend_1_name, etc.) not a repeating section
 */
const populateFriends = (friends: { name: string; description: string }[]) => {
    const updates: { [key: string]: string } = {};

    // Populate up to 5 friend slots
    for (let i = 0; i < 5; i++) {
        const friendNum = i + 1;
        if (friends[i]) {
            updates[`friend_${friendNum}_name`] = friends[i].name;
            updates[`friend_${friendNum}_desc`] = friends[i].description;
        } else {
            // Clear slot if no friend data
            updates[`friend_${friendNum}_name`] = '';
            updates[`friend_${friendNum}_desc`] = '';
        }
    }

    setAttrs(updates);
};

/**
 * Reset friend relations to neutral (used on playbook reset)
 */
const resetFriendRelations = () => {
    const updates: { [key: string]: string } = {};
    for (let i = 1; i <= 5; i++) {
        updates[`friend_${i}_relation`] = 'neutral';
    }
    setAttrs(updates);
};

/**
 * Handle playbook change - populate XP trigger, items, augments, friends (NOT actions)
 * Actions are only set via explicit reset to preserve advanced characters
 */
const handlePlaybookChange = (newPlaybook: string) => {
    if (!newPlaybook || !PLAYBOOK_DATA[newPlaybook]) return;

    const data = PLAYBOOK_DATA[newPlaybook];

    // 1. Set XP trigger
    setAttrs({ xp_trigger: data.xpTrigger });

    // 2. Clear old autogen items, populate new ones
    clearAndPopulateRepeatingSection("items", data.items, formatPlaybookItem);

    // 3. Clear old autogen augments, populate new ones
    clearAndPopulateRepeatingSection("augments", data.augments, formatAugment);

    // 4. Populate friends from playbook data
    populateFriends(data.friends);

    // Note: Actions are NOT set here - use Reset to Playbook Defaults for that
};

/**
 * Reset character to playbook defaults - clears everything and sets starting actions
 * Used for new characters or when explicitly resetting
 */
const resetToPlaybookDefaults = () => {
    getAttrs(['playbook', 'character_name'], v => {
        const playbook = v.playbook;
        const charName = v.character_name || 'Character';

        if (!playbook || !PLAYBOOK_DATA[playbook]) {
            // No playbook selected - notify via chat
            startRoll(`&{template:dcsb-fortune} {{charname=${charName}}} {{roll=[[0d6]]}} {{notes=Select a playbook first before resetting.}}`,
                results => finishRoll(results.rollId, {}));
            return;
        }

        const data = PLAYBOOK_DATA[playbook];

        // 1. Reset all 12 actions to 0
        const actionReset: { [key: string]: number } = {};
        ACTIONS.forEach(action => {
            actionReset[action] = 0;
        });
        setAttrs(actionReset);

        // 2. Set starting actions for this playbook
        setAttrs(data.actions);

        // 3. Set XP trigger
        setAttrs({ xp_trigger: data.xpTrigger });

        // 4. Clear ALL items (autogen and user-created) and repopulate
        clearAllAndPopulateRepeatingSection("items", data.items, formatPlaybookItem);

        // 5. Clear ALL augments (autogen and user-created) and repopulate
        clearAllAndPopulateRepeatingSection("augments", data.augments, formatAugment);

        // 6. Populate friends and reset their relations
        populateFriends(data.friends);
        resetFriendRelations();

        // 7. Notify success via chat
        startRoll(`&{template:dcsb-fortune} {{charname=${charName}}} {{roll=[[0d6]]}} {{notes=Reset to ${data.title} defaults complete.}}`,
            results => finishRoll(results.rollId, {}));
    });
};

/**
 * Clear ALL rows in a repeating section (not just autogen) and populate new ones
 * Used for full reset
 */
const clearAllAndPopulateRepeatingSection = <T>(
    section: string,
    items: T[],
    formatter: (item: T, rowId: string) => { [key: string]: AttributeContent }
) => {
    getSectionIDs(`repeating_${section}`, ids => {
        // Remove ALL rows
        ids.forEach(id => {
            removeRepeatingRow(`repeating_${section}_${id}`);
        });

        // Add new items with autogen flag
        items.forEach(item => {
            const rowId = generateRowID();
            const attrs = formatter(item, rowId);
            attrs[`repeating_${section}_${rowId}_autogen`] = "1";
            setAttrs(attrs);
        });
    });
};

// =============================================================================
// ATTRIBUTE RATING CALCULATIONS
// =============================================================================

/**
 * Calculate attribute rating as count of actions with at least 1 dot
 */
const calculateAttributeRating = (attribute: string) => {
    const actions = ATTRIBUTES[attribute as keyof typeof ATTRIBUTES];
    if (!actions) return;

    const actionList = [...actions] as string[];
    const attrs = [...actionList, `${attribute}_rating`];
    getAttrs(attrs, v => {
        const count = actionList.filter(a => int(v[a]) > 0).length;
        mySetAttrs({ [`${attribute}_rating`]: count }, v);
    });
};

/**
 * Recalculate all attribute ratings
 */
const calculateAllAttributeRatings = () => {
    Object.keys(ATTRIBUTES).forEach(attr => calculateAttributeRating(attr));
};

// =============================================================================
// LOAD CALCULATIONS
// =============================================================================

/**
 * Calculate current load from checked items
 */
const calculateLoad = () => {
    const standardAttrs = Object.keys(STANDARD_ITEMS);

    getSectionIDs('repeating_items', ids => {
        const repeatAttrs = ids.flatMap(id => [
            `repeating_items_${id}_item_carried`,
            `repeating_items_${id}_item_load`
        ]);

        getAttrs([...standardAttrs, ...repeatAttrs, 'load', 'load_current', 'load_max'], v => {
            // Sum standard items
            let total = standardAttrs.reduce((sum, attr) =>
                sum + (v[attr] === '1' ? STANDARD_ITEMS[attr] : 0), 0);

            // Sum repeating items
            ids.forEach(id => {
                if (v[`repeating_items_${id}_item_carried`] === '1') {
                    total += int(v[`repeating_items_${id}_item_load`], 1);
                }
            });

            // Load max from selection (3=Light, 5=Normal, 6=Heavy)
            const loadMax = int(v.load, LOAD.DEFAULT);

            mySetAttrs({
                load_current: total,
                load_max: loadMax
            }, v);
        });
    });
};

// =============================================================================
// AUGMENT CALCULATIONS
// =============================================================================

/**
 * Calculate augment capacity used (legacy - will be replaced by maintenance clocks)
 * Only counts installed (checked) augments
 */
const calculateAugmentCapacity = () => {
    getSectionIDs('repeating_augments', ids => {
        const installedAttrs = ids.map(id => `repeating_augments_${id}_augment_installed`);

        getAttrs([...installedAttrs, 'augment_used', 'augment_max'], v => {
            // Count only installed augments
            const totalUsed = ids.filter(id =>
                v[`repeating_augments_${id}_augment_installed`] === '1'
            ).length;

            mySetAttrs({ augment_used: totalUsed }, v);
        });
    });
};

// =============================================================================
// HEAT GAUGE CALCULATIONS (Crew Sheet)
// =============================================================================

/**
 * Calculate heat gauge dice (unticked segments)
 * Uses fakeradio pattern: score_heat stores 0-8 (number of filled segments)
 * Disengage dice = 8 - filled segments
 */
const calculateHeatDice = () => {
    getAttrs(['score_heat', 'score_heat_dice'], v => {
        const filled = int(v.score_heat);
        const dice = HEAT_GAUGE.SEGMENTS - filled;
        mySetAttrs({ score_heat_dice: dice }, v);
    });
};

// =============================================================================
// CREW TYPE POPULATION FUNCTIONS
// =============================================================================

/**
 * Format a crew ability for the repeating_crewabilities section
 */
const formatCrewAbility = (
    ability: { name: string; description: string },
    rowId: string
): { [key: string]: AttributeContent } => {
    return {
        [`repeating_crewabilities_${rowId}_crew_ability_name`]: ability.name,
        [`repeating_crewabilities_${rowId}_crew_ability_desc`]: ability.description,
        [`repeating_crewabilities_${rowId}_crew_ability_taken`]: "0"
    };
};

/**
 * Format a crew cohort for the repeating_cohorts section
 */
const formatCrewCohort = (
    cohort: { name: string; type: string; tags?: string; edges?: string; flaws?: string },
    rowId: string
): { [key: string]: AttributeContent } => {
    return {
        [`repeating_cohorts_${rowId}_cohort_name`]: cohort.name,
        [`repeating_cohorts_${rowId}_cohort_type`]: cohort.type,
        [`repeating_cohorts_${rowId}_cohort_tags`]: cohort.tags || "",
        [`repeating_cohorts_${rowId}_cohort_edges`]: cohort.edges || "",
        [`repeating_cohorts_${rowId}_cohort_flaws`]: cohort.flaws || ""
    };
};

/**
 * Clear all crew upgrade checkboxes
 */
const clearCrewUpgrades = (callback?: () => void) => {
    const updates: { [key: string]: string } = {};

    // Clear single-level upgrades
    CREW_UPGRADES_SINGLE.forEach(attr => {
        updates[attr] = "0";
    });

    // Clear multi-level upgrades
    Object.entries(CREW_UPGRADES_MULTI).forEach(([baseName, levels]) => {
        for (let i = 1; i <= levels; i++) {
            updates[`${baseName}_${i}`] = "0";
        }
    });

    setAttrs(updates, { silent: true }, callback);
};

/**
 * Set crew upgrades based on crew type data
 */
const setCrewUpgrades = (upgrades: { checkboxes: string[]; multi: { [baseName: string]: number } }) => {
    const updates: { [key: string]: string } = {};

    // Set single-level upgrades
    upgrades.checkboxes.forEach(attr => {
        updates[attr] = "1";
    });

    // Set multi-level upgrades (check up to the specified level)
    Object.entries(upgrades.multi).forEach(([baseName, level]) => {
        for (let i = 1; i <= level; i++) {
            updates[`${baseName}_${i}`] = "1";
        }
    });

    if (Object.keys(updates).length > 0) {
        setAttrs(updates);
    }
};

/**
 * Handle crew type change - populate abilities, cohorts, and upgrades
 */
const handleCrewTypeChange = (newCrewType: string) => {
    if (!newCrewType || !CREW_DATA[newCrewType]) return;

    const data = CREW_DATA[newCrewType];

    // 1. Clear and populate crew abilities
    clearAndPopulateRepeatingSection("crewabilities", data.abilities, formatCrewAbility);

    // 2. Clear and populate cohorts
    clearAndPopulateRepeatingSection("cohorts", data.cohorts, formatCrewCohort);

    // 3. Clear all upgrades, then set the starting ones
    clearCrewUpgrades(() => {
        setCrewUpgrades(data.upgrades);
    });
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize all calculations on sheet open
 */
const initializeSheet = () => {
    calculateAllAttributeRatings();
    calculateLoad();
    calculateAugmentCapacity();
    calculateHeatDice();
};
