// Dark City, Shining Babel - Game Data Constants
// Static data for actions, playbooks, cybernetics, etc.

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

// TODO: Add cybernetics data per playbook
// TODO: Add items data
// TODO: Add crew upgrade data
