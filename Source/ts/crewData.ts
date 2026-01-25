// Dark City, Shining Babel - Crew Type Data
// Data structure for auto-populating crew abilities, cohorts, and upgrades

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface CrewAbility {
    name: string;
    description: string;
}

interface CrewContact {
    name: string;
    description: string;
}

interface CrewClaim {
    name: string;
    benefit: string;
}

interface CrewCohort {
    name: string;
    type: "talent" | "suits" | "couriers" | "catches" | "clubs" | "expert";
    tags?: string;
    edges?: string;
    flaws?: string;
}

interface CrewUpgrades {
    // Single checkbox attributes to set to "1"
    checkboxes: string[];
    // Multi-level upgrades: base name -> level (e.g., "lair_secure" -> 1 means check lair_secure_1)
    multi: { [baseName: string]: number };
}

interface CrewTypeUpgrade {
    name: string;
    description: string;
    levels?: number;  // For multi-level upgrades like (3) or (2), omit for single checkbox
}

interface CrewData {
    title: string;
    xpTrigger: string;                 // Crew-specific XP trigger
    abilities: CrewAbility[];
    cohorts: CrewCohort[];
    upgrades: CrewUpgrades;
    typeUpgrades: CrewTypeUpgrade[];   // Crew-type specific upgrades
    contacts: CrewContact[];           // Crew-type specific contacts
    claims: CrewClaim[];               // 14 claims for 5×3 grid (positions 1-7, 9-15; 8 is Lair)
    claimConnections: [number, number][];  // Pairs of connected positions (8 = Lair)
}

// =============================================================================
// CREW TYPE DATA
// =============================================================================

const CREW_DATA: { [key: string]: CrewData } = {
    // =========================================================================
    // FIREBRANDS - The Revolution is Electric
    // Starting: Hidden, Cohort: Rooks
    // =========================================================================
    firebrands: {
        title: "Firebrands",
        xpTrigger: "You struck a blow against the Oppressors or advanced your ideology",
        abilities: [
            {
                name: "Cracks in the Tower",
                description: "Each PC may add +1 action rating to Dominate, Vandalize or Tamper."
            },
            {
                name: "True Believers",
                description: "When the crew successfully harms their Oppressor, each PC's first Indulge Vice roll gains +1d and cannot over indulge."
            },
            {
                name: "Rage Capital",
                description: "When you manipulate a person or group's long running frustration into an act of violence, take increased effect and +1d."
            },
            {
                name: "Martyrdom",
                description: "When people think a peaceful bystander is killed by your Oppressors, -2 score Heat."
            },
            {
                name: "Idealogues",
                description: "Your cohorts are willing to lay down their lives and the lives of others for the sake of The Cause, no matter what. Give them the tag Loyal. They gain +1d when acting against your Oppressor."
            },
            {
                name: "Into the Crowd",
                description: "+1d on Disengagement Rolls. On a Failed roll, choose 2 instead of all 3."
            },
            {
                name: "Patron",
                description: "When you advance your Tier, it costs half the coin it normally would. Who is your patron? Why do they help you?"
            }
        ],
        cohorts: [
            {
                name: "Rooks",
                type: "clubs",
                tags: "Thugs",
                edges: "",
                flaws: ""
            }
        ],
        upgrades: {
            checkboxes: ["lair_hidden"],
            multi: {}
        },
        typeUpgrades: [
            { name: "Beat Down but Unbroken", description: "+1 Trauma Box", levels: 3 },
            { name: "Revolutionary Rigging", description: "2 free load of documents and implements" },
            { name: "Prohibited Library", description: "Acts as a workshop for documents and provides +1d for Gathering Info rolls" },
            { name: "System Adaptation", description: "Filling Personal XP now expands a crew member's augment capacity by 2 instead of 1", levels: 2 },
            { name: "Elite Rooks", description: "Your Rooks cohort gains +1 quality" },
            { name: "Elite Thugs", description: "Your Thugs cohorts gain +1 quality" }
        ],
        contacts: [
            { name: "Bad Faith", description: "violent accelerationist" },
            { name: "Lantier", description: "corporate Saboteur" },
            { name: "Heintz", description: "info runner" },
            { name: "X", description: "controversial musician" },
            { name: "Virgil", description: "Well academic" },
            { name: "Narrow", description: "escaped Ruiner" }
        ],
        claims: [
            // Row 1: positions 1-5
            { name: "Allyship", benefit: "Your Rooks get +1 Scale" },
            { name: "Inflamatory Bar", benefit: "Roll = Tier (Highest Roll - Heat = Coin)" },
            { name: "Looting", benefit: "+2 Coin from Direct Action Scores" },
            { name: "Turf", benefit: "" },
            { name: "Believer on the Inside", benefit: "+1d to Infiltration Engagement Plans" },
            // Row 2: positions 6-7 (8 is Lair)
            { name: "Expansion", benefit: "Add Another Area of Change to your Belief" },
            { name: "Turf", benefit: "" },
            // Row 2: positions 9-10
            { name: "Turf", benefit: "" },
            { name: "Expansion", benefit: "Add Another Area of Change to your Belief" },
            // Row 3: positions 11-15
            { name: "In Every Feed", benefit: "+1 Rep on Every Score Targeting your Oppressor" },
            { name: "Static", benefit: "+1d on Reduce Heat Rolls" },
            { name: "Gathering Hall", benefit: "+1d to Dominate & Sway on site" },
            { name: "Operation Studio", benefit: "Your Cohorts get 1 free downtime action" },
            { name: "Multiple Fronts", benefit: "Add Another Area of Change to your Belief" }
        ],
        // Claim connections: [from, to] pairs (8 = Lair)
        // Firebrands: Full grid - all adjacent cells connected
        claimConnections: [
            [1, 2], [2, 3], [3, 4], [4, 5],
            [6, 7], [7, 8], [8, 9], [9, 10],
            [11, 12], [12, 13], [13, 14], [14, 15],
            [1, 6], [6, 11], [2, 7], [7, 12],
            [3, 8], [8, 13], [4, 9], [9, 14], [5, 10], [10, 15]
        ]
    },

    // =========================================================================
    // LEECHES - Vice Dealers
    // Starting: Secure, Training: Resolve
    // =========================================================================
    leeches: {
        title: "Leeches",
        xpTrigger: "You executed a deal or expanded your clientele or supply chain",
        abilities: [
            {
                name: "Silver Tongues",
                description: "Each PC may add +1 action rating to Dominate, Consort, or Sway (up to a max rating of 3)."
            },
            {
                name: "Coalition",
                description: "Sometimes friends are as good as territory. You may count up to three +3 faction statuses you hold as if they are turf."
            },
            {
                name: "The Good Stuff",
                description: "Your merchandise is exquisite. The product quality is equal to your Tier+2. When you deal with a crew or faction, the GM will tell you who among them is hooked on your product (one, a few, many, or all)."
            },
            {
                name: "Brand Recognition",
                description: "When you take heat as a consequence, your crew also gains +1 Rep."
            },
            {
                name: "High Society",
                description: "It's all about who you know. Take -1 heat during downtime and +1d to gather info about the city's elite."
            },
            {
                name: "Hooked",
                description: "Your gang members use your product. Add the savage, unreliable, or wild flaw to your gangs to give them +1 quality."
            },
            {
                name: "Patron",
                description: "When you advance your Tier, it costs half the coin it normally would. Who is your patron? Why do they help you?"
            }
        ],
        cohorts: [],
        upgrades: {
            checkboxes: ["train_resolve"],
            multi: { "lair_secure": 1 }
        },
        typeUpgrades: [
            { name: "Composed", description: "+1 Stress Box", levels: 3 },
            { name: "Leech's Rigging", description: "1 Item has no load and is concealed" },
            { name: "Friends on the Inside", description: "+1 Tier in The Slab" },
            { name: "System Adaptation", description: "Filling Personal XP now expands a crew member's augment capacity by 2 instead of 1", levels: 2 },
            { name: "Elite Rooks", description: "Your Rooks cohort gains +1 quality" },
            { name: "Elite Thugs", description: "Your Thugs cohorts gain +1 quality" }
        ],
        contacts: [
            { name: "Silk", description: "wandering vendor" },
            { name: "Astko", description: "Slab Agent" },
            { name: "Khalil", description: "Corporate Courier" },
            { name: "Rayya", description: "Flotilla Smuggler" },
            { name: "Grif", description: "Mercenary Captain" },
            { name: "Noble", description: "sleazy Marketer" }
        ],
        claims: [
            // Row 1: positions 1-5
            { name: "Turf", benefit: "" },
            { name: "Cheap Labor", benefit: "Treat Upkeep as 1 Tier Lower" },
            { name: "Local Graft", benefit: "+2 coin for show of force or socialize" },
            { name: "Turf", benefit: "" },
            { name: "Sell in the Circle", benefit: "(Tier roll) - Heat = coin in downtime" },
            // Row 2: positions 6-7 (8 is Lair)
            { name: "Lookouts", benefit: "+1d to Survey or Hunt on your turf" },
            { name: "Turf", benefit: "" },
            // Row 2: positions 9-10
            { name: "Turf", benefit: "" },
            { name: "Luxury Venue", benefit: "+1d to Consort and Sway on site" },
            // Row 3: positions 11-15
            { name: "Informants", benefit: "+1d gather info for scores" },
            { name: "Vice Den", benefit: "(Tier roll) - Heat = coin in downtime" },
            { name: "Surplus Caches", benefit: "+2 coin for product sale or supply" },
            { name: "Cover Operation", benefit: "-2 heat per score" },
            { name: "Cover Identities", benefit: "+1d engagement for deception and transport plans" }
        ],
        // Claim connections: [from, to] pairs (8 = Lair)
        // Leeches: Full grid - all adjacent cells connected
        claimConnections: [
            [1, 2], [2, 3], [3, 4], [4, 5],
            [6, 7], [7, 8], [8, 9], [9, 10],
            [11, 12], [12, 13], [13, 14], [14, 15],
            [1, 6], [6, 11], [2, 7], [7, 12],
            [3, 8], [8, 13], [4, 9], [9, 14], [5, 10], [10, 15]
        ]
    },

    // =========================================================================
    // RUNNERS - Corporate Sellouts
    // Starting: Quality: Weapons, Training: Grit
    // =========================================================================
    runners: {
        title: "Runners",
        xpTrigger: "You completed a contract or acquired new clients or resources",
        abilities: [
            {
                name: "Precision",
                description: "Each PC may add +1 action rating to Hunt, Skulk, or Brawl (up to a max rating of 3)."
            },
            {
                name: "Planned Cover-Up",
                description: "When resisting Consequences for the Heat Gauge or flashing back to reduce the Heat Gauge, take +1d."
            },
            {
                name: "Tools of the Trade",
                description: "When Acquiring an Asset take +1d and increase effect by 1."
            },
            {
                name: "No Traces",
                description: "When you keep an operation quiet or make it look like an accident, you get half the rep value of the target (round up) instead of zero. When you end downtime with zero heat, take +1 rep."
            },
            {
                name: "Clean Entry",
                description: "When you use stealth or subterfuge to \"Secure\" Personnel or Steal Info, take +1d to the engagement roll."
            },
            {
                name: "Clean Getaway",
                description: "Take +1d when rolling the Disengagement Roll."
            },
            {
                name: "Patron",
                description: "When you advance your Tier, it costs half the coin it normally would. Who is your patron? Why do they help you?"
            }
        ],
        cohorts: [],
        upgrades: {
            checkboxes: ["qual_weapons", "train_grit"],
            multi: {}
        },
        typeUpgrades: [
            { name: "Resilient", description: "+1 Trauma Box", levels: 3 },
            { name: "Runner Rigging", description: "2 free load of weapons and gear" },
            { name: "AI Backup", description: "The 1st time a PC would die or permanently trauma out, instead load their backup into a cybernetic shell. Lose 2 actions or 1 augment.", levels: 3 },
            { name: "System Adaptation", description: "Filling Personal XP now expands a crew member's augment capacity by 2 instead of 1", levels: 2 },
            { name: "Elite Thugs", description: "Your Thugs cohorts gain +1 quality" },
            { name: "Corporate Contacts", description: "+1 Tier in Prison" }
        ],
        contacts: [
            { name: "Mr. Johnson", description: "go-between" },
            { name: "Faridah", description: "Weapon Researcher" },
            { name: "Nasiff", description: "Uploaded Consciousness" },
            { name: "Gunther", description: "cybernetic veteran" },
            { name: "Kayabuki", description: "Lawyer" },
            { name: "Zhue", description: "prosthetic radical" }
        ],
        claims: [
            // Row 1: positions 1-5
            { name: "No Teams", benefit: "When doing a Gig against an Ally, gain +1d" },
            { name: "Trusting Employer", benefit: "Take the lowest result for entanglement rolls" },
            { name: "Bargaining Table", benefit: "When taking a job with a recurring client, +1d" },
            { name: "Payoff", benefit: "(Tier roll) - Heat = Coin in downtime" },
            { name: "People Disappear", benefit: "'Killing' Payout Heat is reduced by 1" },
            // Row 2: positions 6-7 (8 is Lair)
            { name: "Turf", benefit: "" },
            { name: "Turf", benefit: "" },
            // Row 2: positions 9-10
            { name: "Turf", benefit: "" },
            { name: "Media Cover Up", benefit: "-2 Heat Per Score" },
            // Row 3: positions 11-15
            { name: "Mil-Tech Plate", benefit: "Both Armor & Heavy Armor cost 1 Less Load" },
            { name: "Neuropozyne", benefit: "+1d to Healing Rolls" },
            { name: "New Gear", benefit: "+1d when designing and building cybernetics" },
            { name: "Turf", benefit: "" },
            { name: "Sensationalism", benefit: "+1 Rep per score" }
        ],
        // Claim connections: [from, to] pairs (8 = Lair)
        // Runners has gaps: no 1↔6, no 5↔10, no 6↔11
        claimConnections: [
            [1, 2], [2, 3], [3, 4], [4, 5],
            [6, 7], [7, 8], [8, 9], [9, 10],
            [11, 12], [12, 13], [13, 14], [14, 15],
            [2, 7], [7, 12],
            [3, 8], [8, 13],
            [4, 9], [9, 14],
            [10, 15]
        ]
    },

    // =========================================================================
    // ZOKUS - Midnight Riders and Street Fighters
    // Starting: Rides, Cohort of Rovers
    // =========================================================================
    zokus: {
        title: "Zokus",
        xpTrigger: "You won a race or battle, or seized territory through force",
        abilities: [
            {
                name: "Born Behind the Wheel",
                description: "Gain +1 in Finesse, Vandalize or Dominate."
            },
            {
                name: "The Hook Up",
                description: "When acquiring new augments, take +1d to the roll and increase your result level by 1 tier."
            },
            {
                name: "All Hands",
                description: "During Downtime, one of your cohorts may perform a downtime activity for the crew to acquire an asset or reduce heat; Or they can give you a relevant bonus die on your own actions."
            },
            {
                name: "Reavers",
                description: "When you fight aboard a vehicle, you gain increased effect for vehicle damage and speed. Your cohorts on bikes get Armor."
            },
            {
                name: "Like Part of the Family",
                description: "Create one of your vehicles as a cohort (use the vehicle edges and flaws, below). Its quality is equal to your Tier +1."
            },
            {
                name: "In the Cut",
                description: "+1 Downtime prior to and +1d on engagement for Scores that seize claims."
            },
            {
                name: "Smooth Ride",
                description: "Gain +1d resistance rolls involving consequences from rolls regarding vehicles."
            }
        ],
        cohorts: [
            {
                name: "Rovers",
                type: "couriers",
                tags: "Drivers, Vehicles",
                edges: "",
                flaws: ""
            }
        ],
        upgrades: {
            checkboxes: [],
            multi: { "lair_rides": 1 }
        },
        typeUpgrades: [
            { name: "Zokus Rigging", description: "2 free load of tools or weapons" },
            { name: "Contacts in The Slab", description: "Your tier counts as 1 higher when surviving The Slab" },
            { name: "System Adaptation", description: "Filling Personal XP now expands a crew member's augment capacity by 2 instead of 1", levels: 2 },
            { name: "Elite Rovers", description: "Your Rovers cohort gains +1 quality" },
            { name: "Elite Thugs", description: "Your Thugs cohorts gain +1 quality" },
            { name: "Special Ride", description: "A special vehicle with unique capabilities", levels: 2 },
            { name: "Roaring", description: "+1 Stress Box", levels: 3 }
        ],
        contacts: [
            { name: "Davi", description: "Junker" },
            { name: "Zhuan", description: "club owner" },
            { name: "Balli", description: "'doctor'" },
            { name: "Hen", description: "middle manager" },
            { name: "Kai", description: "transient" },
            { name: "Bells", description: "razer-girl" }
        ],
        claims: [
            // Row 1: positions 1-5
            { name: "Barracks", benefit: "+1 Scale for your cohorts" },
            { name: "Med Room", benefit: "+1d to healing rolls" },
            { name: "Informants", benefit: "+1d Gather Info on Scores" },
            { name: "Turf", benefit: "" },
            { name: "Scrapper Team", benefit: "+2 coin for lower class targets" },
            // Row 2: positions 6-7 (8 is Lair)
            { name: "Turf", benefit: "" },
            { name: "Turf", benefit: "" },
            // Row 2: positions 9-10
            { name: "Turf", benefit: "" },
            { name: "Gear to Go Around", benefit: "Your cohorts have their own rides" },
            // Row 3: positions 11-15
            { name: "Protection Racket", benefit: "(Tier Roll) - heat = Coin in Downtime" },
            { name: "Intimidation", benefit: "-2 Heat Per Score" },
            { name: "Clout", benefit: "+2 Coin for battle and extortion operations" },
            { name: "All Eyes", benefit: "Gain Rep in Payout = Wanted Level" },
            { name: "On Me", benefit: "Gain Crew Downtime Actions = Wanted Level" }
        ],
        // Claim connections: [from, to] pairs (8 = Lair)
        // Zokus: Full grid - all adjacent cells connected
        claimConnections: [
            [1, 2], [2, 3], [3, 4], [4, 5],
            [6, 7], [7, 8], [8, 9], [9, 10],
            [11, 12], [12, 13], [13, 14], [14, 15],
            [1, 6], [6, 11], [2, 7], [7, 12],
            [3, 8], [8, 13], [4, 9], [9, 14], [5, 10], [10, 15]
        ]
    }
};
