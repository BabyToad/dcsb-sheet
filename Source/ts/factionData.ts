// Dark City, Shining Babel - Faction Data
// Data structure for the Factions tab - relationships with Babel's power players

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface Faction {
    name: string;
    tier: number;           // 1-6
    tierDisplay: string;    // "I" to "VI" (Roman numerals)
    description: string;
    category: 'corps' | 'underworld' | 'fringe' | 'labor' | 'citizens';
}

interface FactionCategory {
    name: string;
    key: string;
    factions: Faction[];
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert numeric tier to Roman numeral display
 */
const tierToRoman = (tier: number): string => {
    const romanNumerals: { [key: number]: string } = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI'
    };
    return romanNumerals[tier] || tier.toString();
};

// =============================================================================
// FACTION DATA
// =============================================================================

const FACTION_DATA: FactionCategory[] = [
    // =========================================================================
    // CORPS - MAJOR (7 factions)
    // The biggest corporate players in Babel
    // =========================================================================
    {
        name: "Corps (Major)",
        key: "corpsmajor",
        factions: [
            {
                name: "The Council",
                tier: 6,
                tierDisplay: "VI",
                description: "The top 8 corps maintaining hegemony across Babel",
                category: "corps"
            },
            {
                name: "Morningstar",
                tier: 5,
                tierDisplay: "V",
                description: "Military-tech security teams, private armies for hire",
                category: "corps"
            },
            {
                name: "Cronus Construction",
                tier: 5,
                tierDisplay: "V",
                description: "Mega-scale construction and infrastructure",
                category: "corps"
            },
            {
                name: "Kodama Munitions",
                tier: 4,
                tierDisplay: "IV",
                description: "Military and prison-labor weapon manufacturer",
                category: "corps"
            },
            {
                name: "World Valley Medical",
                tier: 4,
                tierDisplay: "IV",
                description: "Microsoft-y cybernetics provider, basic replacement limbs",
                category: "corps"
            },
            {
                name: "Nobusama Logistics",
                tier: 4,
                tierDisplay: "IV",
                description: "Shipping, transport, and supply chain operations",
                category: "corps"
            },
            {
                name: "Nutrition Unlimited",
                tier: 4,
                tierDisplay: "IV",
                description: "Food production and distribution megacorp",
                category: "corps"
            }
        ]
    },

    // =========================================================================
    // CORPS - MINOR (7 factions)
    // Smaller but still significant corporate entities
    // =========================================================================
    {
        name: "Corps (Minor)",
        key: "corpsminor",
        factions: [
            {
                name: "WyndCom",
                tier: 4,
                tierDisplay: "IV",
                description: "Air and space travel leader, cheap fast and sleek",
                category: "corps"
            },
            {
                name: "NERPS!",
                tier: 3,
                tierDisplay: "III",
                description: "Tesla with flamethrowers and weed. Oxygen bars, cool kid augments",
                category: "corps"
            },
            {
                name: "Oh-Di",
                tier: 3,
                tierDisplay: "III",
                description: "Omni-Health Directional - healthcare and pharmaceuticals",
                category: "corps"
            },
            {
                name: "Zirinka Computing",
                tier: 3,
                tierDisplay: "III",
                description: "Computing and networking infrastructure",
                category: "corps"
            },
            {
                name: "Takam Housing",
                tier: 3,
                tierDisplay: "III",
                description: "Housing and property development",
                category: "corps"
            },
            {
                name: "Surma School Labs",
                tier: 3,
                tierDisplay: "III",
                description: "Education and research laboratories",
                category: "corps"
            },
            {
                name: "Kinnara Generation",
                tier: 3,
                tierDisplay: "III",
                description: "Power generation and energy infrastructure",
                category: "corps"
            }
        ]
    },

    // =========================================================================
    // THE UNDERWORLD (10 factions)
    // Criminal organizations operating in Babel's shadows
    // =========================================================================
    {
        name: "The Underworld",
        key: "underworld",
        factions: [
            {
                name: "Cyber Monday",
                tier: 3,
                tierDisplay: "III",
                description: "Thieves and brutes who steal augments from corps",
                category: "underworld"
            },
            {
                name: "134º",
                tier: 2,
                tierDisplay: "II",
                description: "Nightclub empire with drug runners in the streets",
                category: "underworld"
            },
            {
                name: "Dark Wire",
                tier: 2,
                tierDisplay: "II",
                description: "Information brokers and data thieves",
                category: "underworld"
            },
            {
                name: "Damage Inc.",
                tier: 2,
                tierDisplay: "II",
                description: "Mercenary outfit, violence for hire",
                category: "underworld"
            },
            {
                name: "Bomb Threat",
                tier: 1,
                tierDisplay: "I",
                description: "Demolitions specialists and anarchist bombers",
                category: "underworld"
            },
            {
                name: "Quicksilver",
                tier: 2,
                tierDisplay: "II",
                description: "Fast couriers and smugglers",
                category: "underworld"
            },
            {
                name: "Fleece",
                tier: 2,
                tierDisplay: "II",
                description: "Con artists and grifters",
                category: "underworld"
            },
            {
                name: "Math Squad",
                tier: 2,
                tierDisplay: "II",
                description: "Number runners and gambling operations",
                category: "underworld"
            },
            {
                name: "Red Leather",
                tier: 3,
                tierDisplay: "III",
                description: "Flesh trade and pleasure industry",
                category: "underworld"
            },
            {
                name: "High Water",
                tier: 3,
                tierDisplay: "III",
                description: "Water smugglers and flood zone operators",
                category: "underworld"
            }
        ]
    },

    // =========================================================================
    // FRINGE & LABOR (10 factions)
    // Revolutionaries, idealists, and workers' organizations
    // =========================================================================
    {
        name: "Fringe & Labor",
        key: "fringe",
        factions: [
            {
                name: "The Flotilla",
                tier: 3,
                tierDisplay: "III",
                description: "Anarcho-communist boat collective, smugglers of goods and ideas",
                category: "fringe"
            },
            {
                name: "Taxi & Transport",
                tier: 3,
                tierDisplay: "III",
                description: "Ground transportation union",
                category: "labor"
            },
            {
                name: "The Dockers",
                tier: 3,
                tierDisplay: "III",
                description: "Port workers and shipping handlers",
                category: "labor"
            },
            {
                name: "Laborers",
                tier: 3,
                tierDisplay: "III",
                description: "General workers' collective",
                category: "labor"
            },
            {
                name: "Brass Roses",
                tier: 2,
                tierDisplay: "II",
                description: "Revolutionary hacker squad",
                category: "fringe"
            },
            {
                name: "Brahmin",
                tier: 2,
                tierDisplay: "II",
                description: "Religious revivalists and spiritual resistance",
                category: "fringe"
            },
            {
                name: "The Indentured",
                tier: 2,
                tierDisplay: "II",
                description: "Debt-bound workers organizing in secret",
                category: "labor"
            },
            {
                name: "Journos",
                tier: 2,
                tierDisplay: "II",
                description: "Underground journalists and truth-seekers",
                category: "labor"
            },
            {
                name: "Kar Ptiwati",
                tier: 1,
                tierDisplay: "I",
                description: "Thai dissidents and revolutionaries against the corps",
                category: "fringe"
            },
            {
                name: "Cognitive Dissidents",
                tier: 1,
                tierDisplay: "I",
                description: "Anti-tech philosophers and luddites",
                category: "fringe"
            }
        ]
    },

    // =========================================================================
    // CITIZENS (8 factions)
    // The districts and populations of Babel itself
    // =========================================================================
    {
        name: "Citizens",
        key: "citizens",
        factions: [
            {
                name: "New World City",
                tier: 1,
                tierDisplay: "I",
                description: "Immigrant district, fresh arrivals to Babel",
                category: "citizens"
            },
            {
                name: "The Slums",
                tier: 1,
                tierDisplay: "I",
                description: "The poorest district, forgotten by the corps",
                category: "citizens"
            },
            {
                name: "The Slab",
                tier: 2,
                tierDisplay: "II",
                description: "Factory district above, gladiatorial testing below",
                category: "citizens"
            },
            {
                name: "The Kitchen",
                tier: 2,
                tierDisplay: "II",
                description: "Food processing and service district",
                category: "citizens"
            },
            {
                name: "The Town",
                tier: 3,
                tierDisplay: "III",
                description: "Middle-class residential area",
                category: "citizens"
            },
            {
                name: "The Resort",
                tier: 3,
                tierDisplay: "III",
                description: "Entertainment and leisure district",
                category: "citizens"
            },
            {
                name: "The Lux",
                tier: 4,
                tierDisplay: "IV",
                description: "Wealthy residential towers",
                category: "citizens"
            },
            {
                name: "The Corporate Center",
                tier: 5,
                tierDisplay: "V",
                description: "Gleaming towers of corporate power",
                category: "citizens"
            }
        ]
    }
];

/**
 * Get all factions as a flat array for populating the repeating section
 */
const getAllFactions = (): Faction[] => {
    return FACTION_DATA.flatMap(category => category.factions);
};

/**
 * Get factions by category
 */
const getFactionsByCategory = (categoryKey: string): Faction[] => {
    const category = FACTION_DATA.find(cat => cat.key === categoryKey);
    return category ? category.factions : [];
};
