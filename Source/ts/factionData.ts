// Dark City, Shining Babel - Faction Data
// Conglomerate notice and company relationships
// Source: The New Babel rulebook (Dylan's Google Doc, March 2026)
//
// Conglomerates are beyond Tier. They can only be targeted through subsidiaries.
// Pillar (+/-2 Rep) = 2 conglomerate ticks
// Major (+/-2 Rep) = 1 conglomerate tick
// Minor = no conglomerate ticks (but may affect larger companies)

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Faction {
    name: string;
    tier: number;           // 1-6
    tierDisplay: string;    // "I" to "VI" (Roman numerals)
    description: string;
    conglomerate: string;   // Which conglomerate this company belongs to
    rank: 'pillar' | 'major' | 'minor';
}

interface Conglomerate {
    name: string;
    key: string;
    label: string;          // Display label with BSX ticker and specialization
    factions: Faction[];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const tierToRoman = (tier: number): string => {
    const romanNumerals: { [key: number]: string } = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI'
    };
    return romanNumerals[tier] || tier.toString();
};

// =============================================================================
// CONGLOMERATE SLUGS (for attribute names)
// =============================================================================

const CONGLOMERATE_SLUGS = [
    'chaebol',
    'worldvalley',
    'kernkeiwit',
    'wyndcom',
    'palantir',
    'globalextraction'
] as const;

// =============================================================================
// FACTION DATA — Canonical from The New Babel
// =============================================================================

const FACTION_DATA: Conglomerate[] = [
    // =========================================================================
    // CHAEBOL (BSX: CHA) — Industrial
    // =========================================================================
    {
        name: "Chaebol",
        key: "chaebol",
        label: "CHA — Industrial",
        factions: [
            {
                name: "Cronus Construction",
                tier: 6, tierDisplay: "VI",
                description: "Mega-scale construction and infrastructure",
                conglomerate: "chaebol", rank: "pillar"
            },
            {
                name: "Kodama Munitions",
                tier: 5, tierDisplay: "V",
                description: "Military and prison-labor weapon manufacturer",
                conglomerate: "chaebol", rank: "pillar"
            },
            {
                name: "Hype",
                tier: 5, tierDisplay: "V",
                description: "Mass media and talent cultivation. Originated in K-Pop, trains talent and cultivates 'authentic music narratives'",
                conglomerate: "chaebol", rank: "pillar"
            },
            {
                name: "Nutrition Unlimited",
                tier: 4, tierDisplay: "IV",
                description: "Food production and distribution megacorp",
                conglomerate: "chaebol", rank: "major"
            },
            {
                name: "Nobusama",
                tier: 4, tierDisplay: "IV",
                description: "Cars, boats, planes, construction equipment",
                conglomerate: "chaebol", rank: "major"
            },
            {
                name: "Surma School Labs",
                tier: 3, tierDisplay: "III",
                description: "Education and research laboratories",
                conglomerate: "chaebol", rank: "major"
            }
        ]
    },

    // =========================================================================
    // WORLD VALLEY (BSX: WVM) — Biotechnology
    // =========================================================================
    {
        name: "World Valley",
        key: "worldvalley",
        label: "WVM — Biotechnology",
        factions: [
            {
                name: "WV Cybernetics",
                tier: 6, tierDisplay: "VI",
                description: "The leader in cybernetic advancements",
                conglomerate: "worldvalley", rank: "pillar"
            },
            {
                name: "Cyto",
                tier: 5, tierDisplay: "V",
                description: "Disease research",
                conglomerate: "worldvalley", rank: "pillar"
            },
            {
                name: "Vitae",
                tier: 5, tierDisplay: "V",
                description: "Water treatment and study",
                conglomerate: "worldvalley", rank: "pillar"
            }
        ]
    },

    // =========================================================================
    // KERN-KEIWIT (BSX: KKX) — Finance
    // =========================================================================
    {
        name: "Kern-Keiwit",
        key: "kernkeiwit",
        label: "KKX — Finance",
        factions: [
            {
                name: "Babel Stock Exchange",
                tier: 6, tierDisplay: "VI",
                description: "BSX: BSX",
                conglomerate: "kernkeiwit", rank: "pillar"
            },
            {
                name: "Kern-Keiwit Investment",
                tier: 5, tierDisplay: "V",
                description: "Money flows through KKI into many companies and startups. They all get pulled under the umbrella",
                conglomerate: "kernkeiwit", rank: "pillar"
            },
            {
                name: "Shining Insurance",
                tier: 5, tierDisplay: "V",
                description: "Insurance",
                conglomerate: "kernkeiwit", rank: "pillar"
            }
        ]
    },

    // =========================================================================
    // WYNDCOM (BSX: WYC) — Logistics
    // =========================================================================
    {
        name: "WyndCom",
        key: "wyndcom",
        label: "WYC — Logistics",
        factions: [
            {
                name: "Takam Housing",
                tier: 3, tierDisplay: "III",
                description: "Housing and property development",
                conglomerate: "wyndcom", rank: "major"
            }
        ]
    },

    // =========================================================================
    // PALANTIR (BSX: PAL) — Information
    // =========================================================================
    {
        name: "Palantir",
        key: "palantir",
        label: "PAL — Information",
        factions: [
            {
                name: "Meta",
                tier: 6, tierDisplay: "VI",
                description: "Surveillance and social media",
                conglomerate: "palantir", rank: "pillar"
            },
            {
                name: "Morningstar",
                tier: 5, tierDisplay: "V",
                description: "Special forces and investigation",
                conglomerate: "palantir", rank: "pillar"
            },
            {
                name: "OmniHealth Directional",
                tier: 4, tierDisplay: "IV",
                description: "Drug pushers, mood machines (BSX: OHDI)",
                conglomerate: "palantir", rank: "major"
            },
            {
                name: "NERPS!",
                tier: 3, tierDisplay: "III",
                description: "Tesla with flamethrowers and weed. Oxygen bars, cool kid augments (BSX: NERP)",
                conglomerate: "palantir", rank: "major"
            },
            {
                name: "Five-O",
                tier: 2, tierDisplay: "II",
                description: "Be an Uber driver, except get deputized and given criminal targets",
                conglomerate: "palantir", rank: "minor"
            }
        ]
    },

    // =========================================================================
    // GLOBAL EXTRACTION (BSX: GBC) — Resource Extraction
    // =========================================================================
    {
        name: "Global Extraction",
        key: "globalextraction",
        label: "GBC — Resource Extraction",
        factions: [
            {
                name: "New Era Energy",
                tier: 6, tierDisplay: "VI",
                description: "Nuclear energy powering most of the city (BSX: GEE)",
                conglomerate: "globalextraction", rank: "pillar"
            },
            {
                name: "RRR",
                tier: 5, tierDisplay: "V",
                description: "Recover, Reclaim, Rebuild. International sites in collapsed states — looting historical objects and nuclear missile sites (BSX: RRR)",
                conglomerate: "globalextraction", rank: "pillar"
            },
            {
                name: "THE-COPS",
                tier: 3, tierDisplay: "III",
                description: "Law enforcement",
                conglomerate: "globalextraction", rank: "major"
            },
            {
                name: "Zirinka Computing",
                tier: 2, tierDisplay: "II",
                description: "Eastern Bloc computers, basis for many black market decks",
                conglomerate: "globalextraction", rank: "minor"
            }
        ]
    }
];

// =============================================================================
// UNDERWORLD FACTIONS (independent, not under conglomerates)
// =============================================================================

interface UnderworldFaction {
    name: string;
    tier: number;
    tierDisplay: string;
    description: string;
}

const UNDERWORLD_DATA: UnderworldFaction[] = [
    { name: "Cyber Monday", tier: 3, tierDisplay: "III", description: "Auged up dominators of New World. Collectors of augments from those they wound" },
    { name: "Petty Vermin", tier: 2, tierDisplay: "II", description: "Territorial mix of lesser gangs in the Sea Wall. Derelict youth fortress" },
    { name: "High Water", tier: 3, tierDisplay: "III", description: "Ex-Morningstar (or secretly still Morningstar). Experienced auged up Runners for hire" },
    { name: "134°", tier: 3, tierDisplay: "III", description: "The hottest club in the underworld. Neutral ground in Jehannam's tunnels" },
    { name: "Dark Wire", tier: 2, tierDisplay: "II", description: "Hackers and mercs who do cleanup work for corporations" },
    { name: "Damage Inc.", tier: 2, tierDisplay: "II", description: "Ex-corp construction team who takes down the buildings they built" },
    { name: "Bomb Threat", tier: 1, tierDisplay: "I", description: "Break & enter runners who used a rock band as cover, until they got too cool to hide" },
    { name: "Quicksilver", tier: 2, tierDisplay: "II", description: "Shiny, gaudy and arrogant brutal street racing group with the slickest rides" },
    { name: "Fleece", tier: 2, tierDisplay: "II", description: "Sneaky smugglers and thieves, selling material and info to the highest bidder" },
    { name: "Math Squad", tier: 2, tierDisplay: "II", description: "1337 h4x0rs modeled after classic 70s-80s nerd looks. Still dangerous" },
    { name: "Red Leather", tier: 3, tierDisplay: "III", description: "Over-dramatic street brawlers, the biggest mohawks in the city" }
];

// =============================================================================
// FRINGE FACTIONS (independent, not under conglomerates)
// =============================================================================

const FRINGE_DATA: UnderworldFaction[] = [
    { name: "The Flotilla", tier: 3, tierDisplay: "III", description: "Anarcho-communist collective on boats. Loot failed states, supply revolutionary forces" },
    { name: "Kar Ptiwati", tier: 1, tierDisplay: "I", description: "Thai dissidents and revolutionaries against the corps" },
    { name: "Brass Roses", tier: 2, tierDisplay: "II", description: "Revolutionary hacker squad" },
    { name: "Brahmin", tier: 2, tierDisplay: "II", description: "Collectivist society in an unattended city block. Grow their own food, keep to themselves" },
    { name: "Cognitive Dissidents", tier: 1, tierDisplay: "I", description: "Experimental burnouts" }
];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const getAllFactions = (): Faction[] => {
    return FACTION_DATA.flatMap(conglomerate => conglomerate.factions);
};

const getFactionsByConglomerate = (conglomerateKey: string): Faction[] => {
    const conglomerate = FACTION_DATA.find(c => c.key === conglomerateKey);
    return conglomerate ? conglomerate.factions : [];
};
