/// <reference path="playbookData.ts" />
/// <reference path="crewData.ts" />
/// <reference path="factionData.ts" />
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
 * Get engagement roll label
 * 1-3: Bad start (disadvantage)
 * 4-5: Risky start (standard)
 * 6: Controlled start (advantage)
 * Crit: Controlled + edge
 */
const getEngagementLabel = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !! Controlled + Edge';
    if (result >= 6) return 'CONTROLLED START';
    if (result >= 4) return 'RISKY START';
    return 'BAD START';
};

/**
 * Get maintenance failure roll label (takes LOWEST die)
 * Crit: Next downtime maintenance costs 0 BC
 * 6: Everything still working
 * 4-5: Player chooses augments to lose access to
 * 1-3: GM secretly chooses augments that will fail during score
 */
const getMaintenanceLabel = (result: number, crit: boolean): string => {
    if (crit) return '!! CRITICAL !! Free maintenance next downtime';
    if (result >= 6) return 'STILL WORKING';
    if (result >= 4) return 'CHOOSE FAILURES';
    return 'GM CHOOSES FAILURES';
};

/**
 * Roll context returned by rollWithModifier
 * Contains position, effect, dice modifier, and formatted notes
 */
interface RollContext {
    position: string;      // controlled, risky, desperate
    effect: string;        // limited, standard, great
    diceMod: number;       // -1 to +5
    modNotes: string;      // Formatted modifier note (e.g., "+2d")
}

/**
 * Execute a roll with position, effect, and dice modifier applied
 * Resets all roll context to defaults after rolling
 * @param baseAttrNames - Attributes needed for the roll (excluding roll context)
 * @param getDiceCount - Function to calculate base dice from attributes
 * @param rollFn - Function that performs the roll given (finalDice, attrs, context)
 */
const rollWithModifier = (
    baseAttrNames: string[],
    getDiceCount: (v: Record<string, string>) => number,
    rollFn: (dice: number, v: Record<string, string>, context: RollContext) => void
): void => {
    getAttrs([...baseAttrNames, 'roll_modifier', 'roll_position', 'roll_effect'], v => {
        const baseDice = getDiceCount(v);
        const mod = int(v.roll_modifier);
        const finalDice = baseDice + mod;

        // Get position and effect
        const position = v.roll_position || 'risky';
        const effect = v.roll_effect || 'standard';

        // Build modifier note for display
        let modNotes = '';
        if (mod > 0) modNotes = `+${mod}d`;
        else if (mod < 0) modNotes = `${mod}d`;

        // Reset all roll context to defaults for next roll
        setAttrs({
            roll_modifier: '0',
            roll_position: 'risky',
            roll_effect: 'standard'
        }, { silent: true });

        const context: RollContext = { position, effect, diceMod: mod, modNotes };
        rollFn(finalDice, v, context);
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
 * Sets visibility for load box 2 based on item load value
 * Special items (italicized in rulebook) are free - don't count toward load
 */
const formatPlaybookItem = (
    item: { name: string; load: number; special?: boolean },
    rowId: string
): { [key: string]: AttributeContent } => {
    return {
        [`repeating_items_${rowId}_item_name`]: item.name,
        [`repeating_items_${rowId}_item_load_1`]: "0",
        [`repeating_items_${rowId}_item_load_2`]: "0",
        // Show load box 2 only for items with load >= 2
        [`repeating_items_${rowId}_item_show_load_2`]: item.load >= 2 ? "1" : "0",
        // Special items are free (don't count toward load) - marked for CSS styling
        [`repeating_items_${rowId}_item_special`]: item.special ? "1" : "0"
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

    // 1. Set XP trigger and playbook-specific visibility flags
    setAttrs({
        xp_trigger: data.xpTrigger,
        // Show chipsets section only for Hacker playbook
        show_chipsets: newPlaybook === 'hacker' ? '1' : '0'
    });

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

        // 3. Set XP trigger and playbook-specific visibility flags
        setAttrs({
            xp_trigger: data.xpTrigger,
            show_chipsets: playbook === 'hacker' ? '1' : '0'
        });

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
 * Each checked load box = 1 load
 * Standard items: item_knife_1, item_large_weapon_1, item_large_weapon_2, etc.
 * Playbook items: item_load_1, item_load_2 per repeating row
 * Special items (italicized) are FREE - don't count toward load
 */
const calculateLoad = () => {
    getSectionIDs('repeating_items', ids => {
        // Playbook items have item_load_1, item_load_2, and item_special per row
        const repeatAttrs = ids.flatMap(id => [
            `repeating_items_${id}_item_load_1`,
            `repeating_items_${id}_item_load_2`,
            `repeating_items_${id}_item_special`
        ]);

        getAttrs([...STANDARD_ITEM_LOAD_ATTRS, ...repeatAttrs, 'load', 'load_current', 'load_max'], v => {
            // Sum standard items - each checked checkbox = 1 load
            let total = STANDARD_ITEM_LOAD_ATTRS.reduce((sum, attr) =>
                sum + (v[attr] === '1' ? 1 : 0), 0);

            // Sum playbook items - each checked load box = 1 load
            // BUT skip special items (they're free)
            ids.forEach(id => {
                const isSpecial = v[`repeating_items_${id}_item_special`] === '1';
                if (!isSpecial) {
                    if (v[`repeating_items_${id}_item_load_1`] === '1') total += 1;
                    if (v[`repeating_items_${id}_item_load_2`] === '1') total += 1;
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
// AUGMENT MAINTENANCE CALCULATIONS
// =============================================================================

/**
 * Calculate augment maintenance ticks and clocks
 * Total ticks = sum of installed augment tiers
 * Full clocks = floor(total ticks / 4) = BC owed at downtime
 */
const calculateAugmentMaintenance = () => {
    getSectionIDs('repeating_augments', ids => {
        const installedAttrs = ids.map(id => `repeating_augments_${id}_augment_installed`);
        const tierAttrs = ids.map(id => `repeating_augments_${id}_augment_tier`);

        getAttrs([...installedAttrs, ...tierAttrs, 'maintenance_ticks', 'maintenance_clocks'], v => {
            // Sum tiers of installed augments
            let totalTicks = 0;
            ids.forEach(id => {
                if (v[`repeating_augments_${id}_augment_installed`] === '1') {
                    totalTicks += int(v[`repeating_augments_${id}_augment_tier`], 2);
                }
            });

            // Full clocks = BC owed
            const fullClocks = Math.floor(totalTicks / MAINTENANCE.CLOCK_SIZE);

            mySetAttrs({
                maintenance_ticks: totalTicks,
                maintenance_clocks: fullClocks
            }, v);
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
 * Format a crew type upgrade for the repeating_crewtypeupgrades section
 */
const formatCrewTypeUpgrade = (
    upgrade: { name: string; description: string; levels?: number },
    rowId: string
): { [key: string]: AttributeContent } => {
    const levels = upgrade.levels || 1;
    return {
        [`repeating_crewtypeupgrades_${rowId}_upgrade_name`]: upgrade.name,
        [`repeating_crewtypeupgrades_${rowId}_upgrade_desc`]: upgrade.description,
        [`repeating_crewtypeupgrades_${rowId}_upgrade_levels`]: String(levels),
        [`repeating_crewtypeupgrades_${rowId}_upgrade_level_1`]: "0",
        [`repeating_crewtypeupgrades_${rowId}_upgrade_level_2`]: "0",
        [`repeating_crewtypeupgrades_${rowId}_upgrade_level_3`]: "0",
        // Control visibility of level 2 and 3 boxes
        [`repeating_crewtypeupgrades_${rowId}_upgrade_show_2`]: levels >= 2 ? "1" : "0",
        [`repeating_crewtypeupgrades_${rowId}_upgrade_show_3`]: levels >= 3 ? "1" : "0"
    };
};

/**
 * Populate crew contact slots from crew type data
 * Contacts are fixed attributes (crew_contact_1_name, etc.) not a repeating section
 */
const populateCrewContacts = (contacts: { name: string; description: string }[]) => {
    const updates: { [key: string]: string } = {};

    // Populate up to 6 contact slots
    for (let i = 0; i < 6; i++) {
        const contactNum = i + 1;
        if (contacts[i]) {
            updates[`crew_contact_${contactNum}_name`] = contacts[i].name;
            updates[`crew_contact_${contactNum}_desc`] = contacts[i].description;
        } else {
            // Clear slot if no contact data
            updates[`crew_contact_${contactNum}_name`] = '';
            updates[`crew_contact_${contactNum}_desc`] = '';
        }
        // Reset relation to neutral when populating
        updates[`crew_contact_${contactNum}_relation`] = 'neutral';
    }

    setAttrs(updates);
};

/**
 * Populate crew claims from crew type data
 * Claims are fixed attributes (claim_1_name, etc.) in a 5×3 grid
 * Positions 1-7 and 9-15 (position 8 is the Lair, not an attribute)
 */
const populateCrewClaims = (claims: { name: string; benefit: string }[]) => {
    const updates: { [key: string]: string } = {};

    // Map claims array indices to attribute position numbers
    // Array indices 0-6 → positions 1-7
    // Array indices 7-13 → positions 9-15
    const positionMap = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];

    positionMap.forEach((position, index) => {
        if (claims[index]) {
            updates[`claim_${position}_name`] = claims[index].name;
            updates[`claim_${position}_benefit`] = claims[index].benefit;
        } else {
            // Clear slot if no claim data
            updates[`claim_${position}_name`] = '';
            updates[`claim_${position}_benefit`] = '';
        }
        // Reset held checkbox when populating
        updates[`claim_${position}_held`] = '0';
    });

    setAttrs(updates);
};

/**
 * Populate claim connection checkboxes based on crew type data
 * Connections are pairs [from, to] where:
 * - |diff| === 1 → horizontal (lower position gets conn_right)
 * - |diff| === 5 → vertical (lower position gets conn_bottom)
 * Position layout:
 *   [1]  [2]  [3]  [4]  [5]
 *   [6]  [7]  [8]  [9]  [10]   (8 = Lair)
 *   [11] [12] [13] [14] [15]
 */
const populateCrewClaimConnections = (connections: [number, number][]) => {
    const updates: { [key: string]: string } = {};

    // All positions that could have connectors
    const allPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    // Clear all connectors first
    allPositions.forEach(pos => {
        updates[`claim_${pos}_conn_right`] = '0';
        updates[`claim_${pos}_conn_bottom`] = '0';
    });

    // Set connectors based on connection pairs
    connections.forEach(([a, b]) => {
        const lower = Math.min(a, b);
        const diff = Math.abs(b - a);

        if (diff === 1) {
            // Horizontal connection - lower position gets right connector
            updates[`claim_${lower}_conn_right`] = '1';
        } else if (diff === 5) {
            // Vertical connection - lower position gets bottom connector
            updates[`claim_${lower}_conn_bottom`] = '1';
        }
        // Note: diff of other values would be diagonal or non-adjacent
    });

    setAttrs(updates);
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
 * Handle crew type change - populate abilities, cohorts, upgrades, type-specific upgrades, and contacts
 */
const handleCrewTypeChange = (newCrewType: string) => {
    if (!newCrewType || !CREW_DATA[newCrewType]) return;

    const data = CREW_DATA[newCrewType];

    // 1. Clear and populate crew abilities
    clearAndPopulateRepeatingSection("crewabilities", data.abilities, formatCrewAbility);

    // 2. Clear and populate cohorts
    clearAndPopulateRepeatingSection("cohorts", data.cohorts, formatCrewCohort);

    // 3. Clear and populate crew type-specific upgrades
    clearAndPopulateRepeatingSection("crewtypeupgrades", data.typeUpgrades, formatCrewTypeUpgrade);

    // 4. Clear all general upgrades, then set the starting ones
    clearCrewUpgrades(() => {
        setCrewUpgrades(data.upgrades);
    });

    // 5. Populate crew contacts from crew type data
    populateCrewContacts(data.contacts);

    // 6. Populate crew claims from crew type data
    populateCrewClaims(data.claims);

    // 7. Populate claim connections from crew type data
    populateCrewClaimConnections(data.claimConnections);

    // 8. Set crew-specific XP trigger
    setAttrs({
        crew_xp_trigger: data.xpTrigger
    });
};

// =============================================================================
// FACTION POPULATION FUNCTIONS
// =============================================================================

/**
 * Map faction category keys to repeating section names
 */
const FACTION_SECTION_MAP: { [key: string]: string } = {
    'corpsmajor': 'factionscorpsmajor',
    'corpsminor': 'factionscorpsminor',
    'underworld': 'factionsunderworld',
    'fringe': 'factionsfringe',
    'citizens': 'factionscitizens'
};

/**
 * Clear all factions from all faction sections
 */
const clearAllFactions = () => {
    const sectionNames = Object.values(FACTION_SECTION_MAP);

    sectionNames.forEach(sectionName => {
        getSectionIDs(sectionName, ids => {
            ids.forEach(id => {
                removeRepeatingRow(`repeating_${sectionName}_${id}`);
            });
        });
    });
};

/**
 * Populate all faction sections in a single batched setAttrs call
 * This avoids issues with multiple rapid setAttrs calls
 */
const populateDefaultFactions = () => {
    // Build a single attrs object with all factions
    const attrs: Record<string, string> = {};

    FACTION_DATA.forEach(category => {
        const sectionName = FACTION_SECTION_MAP[category.key];
        if (sectionName && category.factions) {
            category.factions.forEach(faction => {
                const rowId = generateRowID();
                attrs[`repeating_${sectionName}_${rowId}_faction_name`] = faction.name;
                attrs[`repeating_${sectionName}_${rowId}_faction_tier`] = faction.tier.toString();
                attrs[`repeating_${sectionName}_${rowId}_faction_tier_display`] = faction.tierDisplay;
                attrs[`repeating_${sectionName}_${rowId}_faction_category`] = faction.category;
                attrs[`repeating_${sectionName}_${rowId}_faction_status`] = "0";
                attrs[`repeating_${sectionName}_${rowId}_faction_desc`] = faction.description;
                attrs[`repeating_${sectionName}_${rowId}_autogen`] = "1";
            });
        }
    });

    // Single setAttrs call with all faction data
    setAttrs(attrs);
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
    calculateAugmentMaintenance();
    calculateHeatDice();
};
