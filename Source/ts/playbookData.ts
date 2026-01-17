// Dark City, Shining Babel - Playbook Data
// All playbook-specific items, actions, augments
// NOTE: Data originally from Mini Rulebook, being updated to match The New Babel

interface PlaybookItem {
    name: string;
    load: number;
    special?: boolean;  // Starred items (*)
}

interface Augment {
    tier: number;
    name: string;
    description: string;
}

interface PlaybookData {
    title: string;
    xpTrigger: string;
    actions: { [action: string]: number };  // action name -> starting dots
    items: PlaybookItem[];
    augments: Augment[];
}

const PLAYBOOK_DATA: { [key: string]: PlaybookData } = {
    face: {
        title: "Face",
        xpTrigger: "You addressed a challenge with deception or influence",
        actions: { sway: 2, consort: 1 },
        items: [
            { name: "Fine Fashion and Jewelry", load: 1 },
            { name: "Fine Disguise Kit", load: 1 },
            { name: "Fine Gossip", load: 1, special: true },
            { name: "Powdered Psychedelics", load: 1, special: true },
            { name: "A luxury weapon", load: 1 }
        ],
        augments: [
            { tier: 2, name: "Kodama Command Link", description: "When you Command a cohort in combat, they continue to fight when they would otherwise break (they're not taken out when they suffer level 3 harm). They gain +1 effect and 1 armor." },
            { tier: 2, name: "Cerebral BC Farming", description: "At the end of each downtime phase, you earn +2 stash." },
            { tier: 2, name: "Augmented Projection", description: "You gain effect when speaking to a crowd." },
            { tier: 3, name: "Human, After All", description: "You know the specific intonations and phrases to gain higher trust from AI systems, as advanced or primitive as they may seem. You have potency when communicating by speaking with Artificial Intelligences." },
            { tier: 3, name: "Hippocampus Inceptor", description: "A retractable cord at the base of your skull can connect to standard ports on an augmented person. You can see their memories. Gain effect when trying to convince someone's unconscious." },
            { tier: 3, name: "Social Enhancer", description: "Mental implant that allows you to pick up on human pheromones and perceive minor body language. Always know when someone is lying to you." },
            { tier: 3, name: "Hypnotic Gaze", description: "When you Sway someone, you may cause them to forget that it's happened until they next interact with you." },
            { tier: 4, name: "FoRK Rewire", description: "Take 2 stress to roll your best action rating while performing a different action. Say how you adapt your skill to this use." },
            { tier: 5, name: "Faceless", description: "If just using it for yourself, your disguise kit becomes zero load. You have a synthetic skin mask that can be changed between scores. You get +1d to rolls attempting to remain disguised or deflect suspicion. Throwing off your disguise surprises people, giving you initiative in the situation." }
        ]
    },

    fixer: {
        title: "Fixer",
        xpTrigger: "You addressed a challenge with connections and calculation",
        actions: { consort: 2, scrutinize: 1 },
        items: [
            { name: "Fine Cover Identity", load: 1, special: true },
            { name: "Fine Bottle of Real Liquor", load: 1 },
            { name: "Blueprints", load: 1 },
            { name: "Toxic Vial", load: 1, special: true },
            { name: "Foldable Pistol", load: 1, special: true }
        ],
        augments: [
            { tier: 2, name: "Tapped Lines", description: "During downtime, you get +1 result level when you acquire an asset or reduce heat." },
            { tier: 2, name: "Camera Feed", description: "You have a tight hold on someone's life. When rolling to influence someone you have blackmail on, take +1d and +effect. When you take this ability, gain blackmail on one NPC." },
            { tier: 2, name: "Data-Vaults", description: "You gain +1d to Consort when you gather information on a target for a score. You get +1d to the engagement roll for that operation." },
            { tier: 2, name: "Future Projections", description: "You may expend your special armor to protect a teammate, or to push yourself when you gather information or work on a long-term project." },
            { tier: 3, name: "Mentat Cerebrum Implant", description: "Due to your careful planning, during downtime, you may give yourself or another crew member +1 downtime action." },
            { tier: 4, name: "Programmed Receptors", description: "When you indulge your vice, you may adjust the dice outcome by 1 or 2 (up or down). An ally who joins in your vice may do the same." }
        ]
    },

    hacker: {
        title: "Hacker",
        xpTrigger: "You addressed a challenge with knowledge or technological prowess",
        actions: { hack: 2, scrutinize: 1 },
        items: [
            { name: "Fine Hacking Deck", load: 2 },
            { name: "Electro-Goggles", load: 1 },
            { name: "Stimulants", load: 1, special: true },
            { name: "Specialty Chipsets (Choose 3)", load: 1 },
            { name: "Extra Chipsets (Choose 2 more)", load: 1 },
            { name: "Subtle Surveillance Equipment", load: 1 }
        ],
        augments: [
            { tier: 2, name: "Electrochemistry", description: "You can use an internal battery to briefly emit a local current of power." },
            { tier: 2, name: "Overflow Blockage", description: "You may expend your special armor to resist a wired-in consequence or push yourself when Hacking." },
            { tier: 2, name: "Chipset Storage", description: "Choose 1 chipset that you will always have access to regardless of the deck or situation." },
            { tier: 3, name: "Rage Against the Machine", description: "You won't let a goon tell you what to do or when to do it. Take +1d to resistance rolls when opposing Corporate authority." },
            { tier: 3, name: "Built-In Hacking Deck", description: "Zero load Fine Deck that you will always have on you." },
            { tier: 3, name: "Bugs in the Code", description: "You can push yourself for one of the following additional effects while hacking: Reduce payoff heat by 1, provide increased effect to another Runner dealing with electronic security measures, or gather information." },
            { tier: 3, name: "Recurring ICE", description: "Done it once, done it a thousand times. Once you have hacked into a system, you get +1d on subsequent rolls on that score to dig deeper into it or change it." },
            { tier: 4, name: "Maim-frame", description: "When you hack into a system, you can overclock equipment to make actions normally outside their operational ability. I.e. A normal camera can now detect specific people, a killer robot can now be used to project a voice, or a stun barrier can be set to kill." },
            { tier: 5, name: "Grok 2.0", description: "You have an AI assistant stored in your brain. Increases potency for all Hacking and most investigative rolls. Not always right." }
        ]
    },

    midnighter: {
        title: "MidNighter",
        xpTrigger: "You addressed a challenge with stealth or evasion",
        actions: { skulk: 2, finesse: 1 },
        items: [
            { name: "Fine Lockpicks", load: 1, special: true },
            { name: "Fine Digitized Camo", load: 1 },
            { name: "Light Climbing Gear", load: 1 },
            { name: "Adaptable Silencer", load: 1, special: true },
            { name: "Night Vision Goggles", load: 1, special: true }
        ],
        augments: [
            { tier: 2, name: "Loaded Targeting", description: "When you attack from hiding or spring a trap, you get +1d." },
            { tier: 3, name: "Accelerated Nerves", description: "When there's a question about who acts first, the answer is you (two characters with Accelerated Nerves act simultaneously)." },
            { tier: 4, name: "Split Fingers", description: "You are not affected by quality or Tier when you bypass security measures." },
            { tier: 4, name: "Shimmering Skin", description: "You may expend your special armor to resist a consequence from detection or security measures, or to push yourself for a feat of athletics or stealth." },
            { tier: 4, name: "Adaptive Camo Skin", description: "Blend into your environment seamlessly. People not looking can't see you, take +1d when hiding against characters who are looking for you." },
            { tier: 5, name: "Mental Link", description: "Choose one of your action ratings. When you lead a group action using that action, you can suffer only 1 stress at most regardless of the number of failed rolls." },
            { tier: 5, name: "Frayed Receptors", description: "When you roll a desperate action, you get +1d to your roll if you also take -1d to any resistance rolls against consequences from your action." }
        ]
    },

    murk: {
        title: "Murk",
        xpTrigger: "You addressed a challenge with perception and precise violence",
        actions: { hunt: 2, recon: 1 },
        items: [
            { name: "Fine Pair of Pistols", load: 1 },
            { name: "Fine Long Rifle", load: 2 },
            { name: "AP Ammo", load: 1 },
            { name: "Lite AI Drone", load: 1, special: true },
            { name: "Drone-Marked Binoculars", load: 1 }
        ],
        augments: [
            { tier: 2, name: "Projected Maps", description: "When you gather info to locate a target, you get +1 effect. When you hide in a prepared position or use camouflage, you get +1d to rolls to avoid detection." },
            { tier: 3, name: "Ruiner Programming", description: "You gain an additional xp trigger: You destroyed someone the voice in your head told you to. If your crew helped you follow directions, also mark crew xp." },
            { tier: 3, name: "Tele-scoped Eyes", description: "You can push yourself to do one of the following: make a ranged attack at extreme distance beyond what's normal for the weapon - unleash a barrage of rapid fire to suppress the enemy." },
            { tier: 3, name: "AI-Link", description: "You can direct your drone with your unconscious mind. Your AI Drone has had some extra attachments added to it. Gain one of the following Edges: swift-flyer, armed, armored, tooled." },
            { tier: 4, name: "Encrypted Lower-Networks", description: "You know what it's like in the deepest recesses of the city. Roll your stash and Acquire Asset rolls get +1d when you are in an impoverished district of the city. You get +1 stress box." },
            { tier: 5, name: "Pain Inhibitors", description: "Penalties from harm are one level less severe (though level 4 harm is still fatal)." }
        ]
    },

    street_warrior: {
        title: "Street Warrior",
        xpTrigger: "You addressed a challenge with martial prowess and audacity",
        actions: { brawl: 2, dominate: 1 },
        items: [
            { name: "Fine Hand Weapon", load: 1 },
            { name: "Fine Long Hand-Weapon", load: 2 },
            { name: "Fine Heavy Weapon", load: 2 },
            { name: "Binds and Cables", load: 1, special: true }
        ],
        augments: [
            { tier: 2, name: "Dulled Receptors", description: "When you trade a worse position for increased effect, take +1d." },
            { tier: 2, name: "Androstenone Emitters", description: "When you unleash physical violence, it's especially frightening. When you Dominate a frightened target, take +1d." },
            { tier: 2, name: "Bladed", description: "You have a melee weapon permanently affixed to one of your limbs, it cannot be lost unless the limb is too." },
            { tier: 3, name: "Temporal Dilation", description: "Gain Special Armor to ignore harm from dodging bullets or to push yourself when traversing through danger." },
            { tier: 3, name: "Boosted Servos", description: "Your load limits are higher. Light: 5. Normal: 7. Heavy: 8." },
            { tier: 4, name: "Replaceable Parts", description: "Permanently fill 1 tick of your healing clock. Get +1d when making the Recovery downtime action." },
            { tier: 4, name: "Kodama Pacification Programming", description: "You can push yourself to do one of the following: perform a feat of physical force that verges on the superhuman - engage a small gang on equal footing in close combat." },
            { tier: 4, name: "Covert Morningstar Compartments", description: "You have a weapon hidden inside one of your limbs. It costs 0 load." }
        ]
    }
};
