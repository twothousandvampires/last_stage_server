import Item from '../Items/Item'
import TemplateAbility from '../Types/TemplateAbility'

export default class characterTemplate {
    stats: any
    public name: string = ''
    stat_count: number = 5
    abilities: TemplateAbility[] = []
    item: Item[] = []
    max_items: number = 2
    stats_description: any

    constructor() {
        this.setTemplate()
    }

    setTemplate(class_name: string = 'swordman'): void {
        if (class_name === 'swordman') {
            this.name = 'swordman'
            this.stats = {
                might: 1,
                agility: 0,
                knowledge: 0,
                will: 0,
                perception: 0,
                durability: 1,
            }
            this.stats_description = {
                might: `- affects the number of targets that can be hit by your abilities
                        - affects the chance of not losing courage when receiving damage
                        - increases your power`,
                agility: `- increases your attack speed
                          - reduces speed penalty when defending
                          - increases pierce rating`,
                knowledge: `- gives a chance to get additional energy
                            - increases status resistance`,
                will: `- increases your life regeneration rate
                       - increases the chance to skip the damage state
                       - reduces your cooldowns of your abilities`,
                perception: `- increases the block chance
                             - reduces penalty of speed when you attacking
                             - increases maximum of energy`,
                durability: `- gives a chance to gain extra life during regeneration
                             - increases your armour`,
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'swing',
                    type: 1,
                    selected: true,
                    desc: 'Cuts nearby enemies.',
                },
                {
                    id: 2,
                    name: 'weapon throw',
                    type: 1,
                    selected: false,
                    desc: 'Throws a copy of your weapon.',
                },
                {
                    id: 10,
                    name: 'dash',
                    type: 1,
                    selected: false,
                    desc: 'Makes a dash damaging enemies. The total distance is increased by your attack speed.',
                },
                {
                    id: 3,
                    name: 'jump',
                    type: 2,
                    selected: true,
                    desc: "You jump. There's a minimum and maximum range. Upon landing, you deal damage to units. While airborne, you're immune to ground-based effects.",
                },
                {
                    id: 4,
                    name: 'charge',
                    type: 2,
                    selected: false,
                    desc: 'You dash forward, stunning everyone in your path.',
                },
                {
                    id: 11,
                    name: 'metal thorns',
                    type: 2,
                    selected: false,
                    desc: 'Deals damage over time around you. The chance to deal damage depends on your armor level. The hit rate depends on your attack speed.',
                },
                {
                    id: 5,
                    name: 'whirlwind',
                    type: 3,
                    selected: true,
                    desc: 'You spin your sword, dealing damage to everyone around you. High courage grants additional spins.',
                },
                {
                    id: 6,
                    name: 'quake',
                    type: 3,
                    selected: false,
                    desc: 'Creates waves that rip apart enemies. Each new wave has a larger radius, and the number of waves depends on your health. The first wave deals damage to you and apply weakness.',
                },
                {
                    id: 6,
                    name: 'heaven wrath',
                    type: 3,
                    selected: false,
                    desc: "Gain an 8-second buff that deals damage to enemies if you've struck within the last 1.5 seconds. The frequency of the strikes is based on your attack speed, and the duration increases with your courage.",
                },
                {
                    id: 9,
                    name: 'spectral swords',
                    type: 3,
                    selected: false,
                    desc: 'Summons 5 swords that fight by your side and have your attack speed.',
                },
                {
                    id: 7,
                    name: 'cursed weapon',
                    type: 4,
                    selected: true,
                    desc: 'Your weapon gains a cursed power, increasing attack speed and attack range for 12 seconds. After this time, you will take damage. High courage grants a chance to avoid damage.',
                },
                {
                    id: 8,
                    name: 'commands',
                    type: 4,
                    selected: false,
                    desc: 'Grants nearby allies speed and armor for 12 seconds. Effect increases by courage.',
                },
                {
                    id: 8,
                    name: 'inner power',
                    type: 5,
                    selected: true,
                    desc: "When you're almost dead, gain a powerful buff that will help you survive. Has a long cooldown.",
                },
                {
                    id: 8,
                    name: 'heaven intervention',
                    type: 5,
                    selected: false,
                    desc: 'When you take damage, there is a chance that the heavens will help you.',
                },
            ]
        } else if (class_name === 'flyer') {
            this.name = 'flyer'
            this.stat_count = 5
            this.stats = {
                might: 1,
                agility: 0,
                knowledge: 2,
                will: 0,
                perception: 0,
                durability: 0,
            }
            this.stats_description = {
                might: `- affects your abilities (increases AOE, number of projectiles, etc.)
                        - reduces cooldowns of your abilities`,
                agility: `- increases your armour
                          - increases your move speed`,
                knowledge: `- gives a chance not to spend mana when used
                            - affect to start amount of energy
                            - increases your power`,
                will: `- gives a chance not to lose mana when block
                       - gives a chance to get additional energy
                       - increases a chance that trigger trigered twice`,
                perception: `- reduces penalty of speed when your cast
                             - gives a chance to get additional courage`,
                durability: `- gives a chance to avoid damage state
                             - increases life regeneration rate`,
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'fireball',
                    type: 1,
                    selected: true,
                    desc: 'Create a ball of flame.',
                },
                {
                    id: 2,
                    name: 'frost sphere',
                    type: 1,
                    selected: false,
                    desc: 'Create a sphere of ice.',
                },
                {
                    id: 9,
                    name: 'lightning bolt',
                    type: 1,
                    selected: false,
                    desc: 'Creates a charge of electricity, damaging one target and shocking nearby targets.',
                },
                {
                    id: 3,
                    name: 'forked lightning',
                    type: 2,
                    selected: true,
                    desc: 'Create a forked electrical charge. When dealing damage, it has a chance to branch out, creating two new ones.',
                },
                {
                    id: 4,
                    name: 'flamewall',
                    type: 2,
                    selected: false,
                    desc: 'Create a ring of fire.',
                },
                {
                    id: 5,
                    name: 'light beacon',
                    type: 3,
                    selected: true,
                    desc: 'You fly up and share your vision also you create electricity charges.',
                },
                {
                    id: 6,
                    name: 'frost nova',
                    type: 3,
                    selected: false,
                    desc: 'Create a circle of frost. Enemies in close range will be shattered other will be frozen.',
                },
                {
                    id: 9,
                    name: 'sparks',
                    type: 3,
                    selected: false,
                    desc: 'Creates beams of electricity that radiate out from you and periodically change direction.',
                },
                {
                    id: 7,
                    name: 'teleportation',
                    type: 4,
                    selected: true,
                    desc: 'Teleports you in certain place.',
                },
                {
                    id: 8,
                    name: 'static field',
                    type: 4,
                    selected: false,
                    desc: 'Units and projectiles can not move in static field.',
                },
                {
                    id: 8,
                    name: 'disintegration',
                    type: 5,
                    selected: true,
                    desc: 'Your hits have a chance to apply fragility on enemies.',
                },
                {
                    id: 8,
                    name: 'accumulation',
                    type: 5,
                    selected: false,
                    desc: 'When you cast 10 spells, realise magick stars equals your courage.',
                },
            ]
        } else if (class_name === 'cultist') {
            this.name = 'cultist'
            this.stat_count = 5
            this.stats = {
                might: 0,
                agility: 0,
                knowledge: 0,
                will: 1,
                perception: 0,
                durability: 2,
            }
            this.stats_description = {
                might: `- increases your attack speed
                        - increases your armour`,
                agility: `- increases your move speed
                          - increases a block chance`,
                knowledge: `- gives a chance not to spend mana when used
                            - increases your cast speed`,
                will: `- gives a chance to avoid damage
                       - increases status resistance
                       - increases your power`,
                perception: `- increases a chance to avoid damage state
                             - reduses cooldowns of abilities`,
                durability: `- increases spirit
                             - gives a chance to get additional energy`,
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'slam',
                    type: 1,
                    selected: true,
                    desc: 'Slam the ground and deal damage to nearby targets.',
                },
                {
                    id: 2,
                    name: 'rune',
                    type: 1,
                    selected: false,
                    desc: 'Create a explosive rune.',
                },
                {
                    id: 10,
                    name: 'soulrender',
                    type: 1,
                    selected: false,
                    desc: 'Tears the enemy, granting a soul charge, each soul charge increases cast speed. if you have more than one soul charge, there is a chance to tear the enemy apart and lose all soul charges.',
                },
                {
                    id: 3,
                    name: 'shield bash',
                    type: 2,
                    selected: true,
                    desc: 'Shield attack. Damage nearby targets and stun distant ones.',
                },
                {
                    id: 4,
                    name: 'grim pile',
                    type: 2,
                    selected: false,
                    desc: 'Сreate a pile of bones which periodically increase armour rate and move speed to you and your teammates.',
                },
                {
                    id: 5,
                    name: 'unleashing pain',
                    type: 3,
                    selected: true,
                    desc: 'Summon a ghost warriors which will hit enemies.',
                },
                {
                    id: 6,
                    name: 'pile of thorns',
                    type: 3,
                    selected: false,
                    desc: 'Create a pile of bones which periodically damage enemies around it.',
                },
                {
                    id: 9,
                    name: 'wandering evil',
                    type: 3,
                    selected: false,
                    desc: 'Summons evil, which enters the being and after some time tears it apart.',
                },
                {
                    id: 7,
                    name: 'self flagellation',
                    type: 4,
                    selected: true,
                    desc: 'Deals damage to you.',
                },
                {
                    id: 8,
                    name: 'ghost form',
                    type: 4,
                    selected: false,
                    desc: 'Become into ghost from getting immune to damage and gives phasing.',
                },
                {
                    id: 8,
                    name: 'unbreakable spirit',
                    type: 5,
                    selected: true,
                    desc: 'When you get damage where is a chance to restore 1 life.',
                },
                {
                    id: 8,
                    name: 'unbreakable armour',
                    type: 5,
                    selected: false,
                    desc: 'When you reach 1 life its permanently gives to you 1 armour and fortification rate up to 20',
                },
            ]
        }
    }

    increseStat(stat: string): void {
        if (this.stat_count > 0) {
            this.stats[stat]++
            this.stat_count--
        }
    }

    decreaseStat(stat: string): void {
        if (this.stats[stat] > 0) {
            this.stats[stat]--
            this.stat_count++
        }
    }
}
