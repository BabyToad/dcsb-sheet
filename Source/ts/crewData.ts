// Dark City, Shining Babel - Crew Type Data
// Data structure for auto-populating crew abilities, cohorts, and upgrades

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface CrewAbility {
    name: string;
    description: string;
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
    abilities: CrewAbility[];
    cohorts: CrewCohort[];
    upgrades: CrewUpgrades;
    typeUpgrades: CrewTypeUpgrade[];  // Crew-type specific upgrades
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
        ]
    },

    // =========================================================================
    // LEECHES - Vice Dealers
    // Starting: Secure, Training: Resolve
    // =========================================================================
    leeches: {
        title: "Leeches",
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
        ]
    },

    // =========================================================================
    // RUNNERS - Corporate Sellouts
    // Starting: Quality: Weapons, Training: Grit
    // =========================================================================
    runners: {
        title: "Runners",
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
        ]
    },

    // =========================================================================
    // ZOKUS - Midnight Riders and Street Fighters
    // Starting: Rides, Cohort of Rovers
    // =========================================================================
    zokus: {
        title: "Zokus",
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
        ]
    }
};
