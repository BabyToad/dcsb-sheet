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
// ATTRIBUTE RATING CALCULATIONS
// =============================================================================

/**
 * Calculate attribute rating as max of its associated actions
 */
const calculateAttributeRating = (attribute: string) => {
    const actions = ATTRIBUTES[attribute as keyof typeof ATTRIBUTES];
    if (!actions) return;

    const attrs = [...actions, `${attribute}_rating`];
    getAttrs(attrs, v => {
        const max = Math.max(...actions.map(a => int(v[a])));
        mySetAttrs({ [`${attribute}_rating`]: max }, v);
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
            const loadMax = int(v.load, 5);

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
 * Each filled slot costs (tier - 1) capacity
 */
const calculateCyberCapacity = () => {
    getSectionIDs('repeating_cybernetics', ids => {
        const attrs = ids.flatMap(id => [
            `repeating_cybernetics_${id}_cyber_tier`,
            `repeating_cybernetics_${id}_cyber_slot_1`,
            `repeating_cybernetics_${id}_cyber_slot_2`,
            `repeating_cybernetics_${id}_cyber_slot_3`
        ]);

        getAttrs([...attrs, 'cyber_used', 'cyber_max'], v => {
            let totalUsed = 0;

            ids.forEach(id => {
                const tier = int(v[`repeating_cybernetics_${id}_cyber_tier`], 2);
                const slots = [1, 2, 3].filter(n =>
                    v[`repeating_cybernetics_${id}_cyber_slot_${n}`] === '1'
                ).length;

                // Each filled slot costs (tier - 1) capacity
                totalUsed += slots * (tier - 1);
            });

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
    const heatAttrs = [1, 2, 3, 4, 5, 6].map(n => `score_heat_${n}`);

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
