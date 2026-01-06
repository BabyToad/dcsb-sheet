/// <reference path="playbookData.ts" />
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
 * Format a cybernetic for the repeating_cybernetics section
 */
const formatCybernetic = (
    cyber: { tier: number; name: string; description: string },
    rowId: string
): { [key: string]: AttributeContent } => {
    return {
        [`repeating_cybernetics_${rowId}_cyber_tier`]: cyber.tier.toString(),
        [`repeating_cybernetics_${rowId}_cyber_name`]: cyber.name,
        [`repeating_cybernetics_${rowId}_cyber_desc`]: cyber.description
    };
};

/**
 * Handle playbook change - populate XP trigger, items, cybernetics (NOT actions)
 * Actions are only set via explicit reset to preserve advanced characters
 */
const handlePlaybookChange = (newPlaybook: string) => {
    if (!newPlaybook || !PLAYBOOK_DATA[newPlaybook]) return;

    const data = PLAYBOOK_DATA[newPlaybook];

    // 1. Set XP trigger
    setAttrs({ xp_trigger: data.xpTrigger });

    // 2. Clear old autogen items, populate new ones
    clearAndPopulateRepeatingSection("items", data.items, formatPlaybookItem);

    // 3. Clear old autogen cybernetics, populate new ones
    clearAndPopulateRepeatingSection("cybernetics", data.cybernetics, formatCybernetic);

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

        // 5. Clear ALL cybernetics (autogen and user-created) and repopulate
        clearAllAndPopulateRepeatingSection("cybernetics", data.cybernetics, formatCybernetic);

        // 6. Notify success via chat
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
// CYBERNETICS CALCULATIONS
// =============================================================================

/**
 * Calculate cybernetics capacity used
 * Only counts installed (checked) cybernetics
 */
const calculateCyberCapacity = () => {
    getSectionIDs('repeating_cybernetics', ids => {
        const installedAttrs = ids.map(id => `repeating_cybernetics_${id}_cyber_installed`);

        getAttrs([...installedAttrs, 'cyber_used', 'cyber_max'], v => {
            // Count only installed cybernetics
            const totalUsed = ids.filter(id =>
                v[`repeating_cybernetics_${id}_cyber_installed`] === '1'
            ).length;

            mySetAttrs({ cyber_used: totalUsed }, v);
        });
    });
};

// =============================================================================
// HEAT GAUGE CALCULATIONS (Crew Sheet)
// =============================================================================

/**
 * Calculate heat gauge dice (unchecked segments)
 */
const calculateHeatDice = () => {
    const heatAttrs = Array.from(
        { length: HEAT_GAUGE.SEGMENTS },
        (_, i) => `score_heat_${i + 1}`
    );

    getAttrs([...heatAttrs, 'score_heat_dice'], v => {
        // Count UNCHECKED segments = dice pool for disengagement
        const unchecked = heatAttrs.filter(attr => v[attr] !== '1').length;
        mySetAttrs({ score_heat_dice: unchecked }, v);
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
    calculateCyberCapacity();
    calculateHeatDice();
};
