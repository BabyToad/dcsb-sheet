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
    SEGMENTS: 6,
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

// Cybernetics capacity
const CYBER = {
    DEFAULT_MAX: 4,
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
    'face', 'fixer', 'l337', 'midnighter', 'murk', 'street_warrior'
] as const;

// Crew types
const CREW_TYPES = [
    'firebrands', 'leeches', 'runners', 'zokus'
] as const;

// Heritage options
const HERITAGES = [
    'sub_cities', 'the_well', 'the_jungle', 'the_syndicate', 'labor_colonies'
] as const;

// Background options
const BACKGROUNDS = [
    'entertainment', 'law', 'labor', 'corporate', 'underworld', 'fringe'
] as const;

// Vice types
const VICES = [
    'faith', 'gambling', 'luxury', 'obligation', 'pleasure', 'stupor', 'weird'
] as const;

// Cybernetic tiers
const CYBERNETIC_TIERS = [2, 3, 4, 5] as const;

// Standard item loads (fixed values)
const STANDARD_ITEMS: {[key: string]: number} = {
    item_blade: 1,
    item_pistol: 1,
    item_ammo: 1,
    item_armor: 2,
    item_heavy: 3,
    item_tools: 1,
    item_climbing: 2,
    item_documents: 1
};

// All attribute names
const ATTRIBUTE_NAMES = ['acuity', 'grit', 'resolve'] as const;
