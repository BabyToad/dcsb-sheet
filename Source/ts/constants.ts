// Dark City, Shining Babel - Game Data Constants
// Static data for actions, playbooks, cybernetics, etc.

// =============================================================================
// GAME RULES CONSTANTS
// =============================================================================

// Dice system (Blades in the Dark derived)
const DICE = {
    SIZE: 6,                    // d6 system
    ZERO_DICE_COUNT: 2,         // Roll 2 dice at 0 rating
    KEEP_HIGHEST: 'kh1',        // Keep highest 1 (standard)
    KEEP_LOWEST: 'kl1',         // Keep lowest 1 (zero dice)
} as const;

// Roll templates
const ROLL_TEMPLATES = {
    ACTION: 'dcsb-action',
    RESISTANCE: 'dcsb-resistance',
    FORTUNE: 'dcsb-fortune',
    VICE: 'dcsb-vice',
} as const;

// Load settings
const LOAD = {
    LIGHT: 3,
    NORMAL: 5,
    HEAVY: 6,
    DEFAULT: 5,
} as const;

// Heat gauge (score tracker)
const HEAT_GAUGE = {
    SEGMENTS: 8,
} as const;

// Stress system
const STRESS = {
    MAX: 9,
    TRAUMA_THRESHOLD: 9,
} as const;

// Trauma system
const TRAUMA = {
    MAX: 4,
} as const;

// Augments (formerly Cybernetics) - use maintenance clocks instead of capacity
const MAINTENANCE = {
    CLOCK_SIZE: 4,  // 4 ticks per maintenance clock
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Build a roll formula for the Blades dice system
 * @param diceCount - Number of action dots (0 = disadvantage)
 * @returns Roll20 roll formula string
 */
const buildRollFormula = (diceCount: number): string => {
    if (diceCount > 0) {
        return `${diceCount}d${DICE.SIZE}${DICE.KEEP_HIGHEST}`;
    }
    return `${DICE.ZERO_DICE_COUNT}d${DICE.SIZE}${DICE.KEEP_LOWEST}`;
};

/**
 * Capitalize first letter of string
 */
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// =============================================================================
// CHARACTER DATA
// =============================================================================

// Attributes and their associated actions
const ATTRIBUTES = {
    acuity: ['hack', 'recon', 'scrutinize', 'tamper'],
    grit: ['brawl', 'hunt', 'skulk', 'vandalize'],
    resolve: ['consort', 'dominate', 'finesse', 'sway']
} as const;

// All 12 actions
const ACTIONS = [
    'brawl', 'consort', 'dominate', 'finesse',
    'hack', 'hunt', 'recon', 'scrutinize',
    'skulk', 'sway', 'tamper', 'vandalize'
] as const;

// Playbooks
const PLAYBOOKS = [
    'face', 'fixer', 'hacker', 'midnighter', 'murk', 'street_warrior'
] as const;

// Crew types
const CREW_TYPES = [
    'firebrands', 'leeches', 'runners', 'zokus'
] as const;

// Heritage options
const HERITAGES = [
    'babel', 'sub_cities', 'the_well', 'the_jungle', 'the_syndicate', 'labor_colonies'
] as const;

// Background options
const BACKGROUNDS = [
    'entertainment', 'law', 'labor', 'corporate', 'underworld', 'fringe'
] as const;

// Vice types
const VICES = [
    'faith', 'gambling', 'luxury', 'obligation', 'pleasure', 'stupor', 'weird'
] as const;

// Augment tiers
const AUGMENT_TIERS = [2, 3, 4, 5] as const;

// Standard item loads (fixed values) - matches The New Babel
// Maps base item name to its total load value (for reference)
const STANDARD_ITEMS: {[key: string]: number} = {
    item_knife: 1,
    item_large_weapon: 2,
    item_reload: 1,
    item_unusual_weapon: 1,
    item_datapad: 1,
    item_armor: 2,
    item_heavy: 1,
    item_infiltration: 1,
    item_hacking: 2,
    item_climbing: 2,
    item_demolition: 2,
    item_tampering: 1,
    item_subterfuge: 1,
    item_documents: 1,
    item_flashlight: 1,
    item_modification: 1
};

// Standard item load checkbox attributes (each checked box = 1 load)
// Generated from STANDARD_ITEMS: item_X with load N gets item_X_1 through item_X_N
const STANDARD_ITEM_LOAD_ATTRS: string[] = (() => {
    const attrs: string[] = [];
    for (const [item, load] of Object.entries(STANDARD_ITEMS)) {
        for (let i = 1; i <= load; i++) {
            attrs.push(`${item}_${i}`);
        }
    }
    return attrs;
})();

// All attribute names
const ATTRIBUTE_NAMES = ['acuity', 'grit', 'resolve'] as const;

// =============================================================================
// CREW UPGRADE ATTRIBUTES
// =============================================================================

// Single-level upgrade checkboxes
const CREW_UPGRADES_SINGLE = [
    'lair_hidden',
    'lair_quarters',
    'lair_workshop',
    'train_acuity',
    'train_grit',
    'train_resolve',
    'train_personal',
    'qual_documents',
    'qual_gear',
    'qual_implements',
    'qual_supplies',
    'qual_tools',
    'qual_weapons'
] as const;

// Multi-level upgrade base names (each has _1, _2, etc.)
const CREW_UPGRADES_MULTI = {
    'lair_rides': 2,
    'lair_specialty': 2,
    'lair_secure': 2,
    'lair_encryption': 2,
    'train_mastery': 4
} as const;
