import Builder from '../Classes/Builder'
import Character from '../Objects/src/Character'
import Forging from './Forgings/Forging'

export default abstract class Item {
    
    public forge: Forging[] = []
    public distance: number = 0
    public chance: number = 0
    public player: Character | undefined
    public max_forgings: number = 4
    public type: number = 1
    public used: boolean = false
    public duration: number = 0
    public count: number = 0
    public description: string = ''
    public disabled: boolean = false
    public suggested_forgings: Forging[] = []
    public cd = 5000
    max_chance: number = 90

    toJSON() {
        return {
            forge: this.forge,
            name: this.name,
            description: this.description,
            max_forgings: this.max_forgings,
        }
    }

    static readonly list = [
        {
            name: 'skull of first warrior',
            description: 'increases your might by 12 for 10 seconds after 12 kills',
        },
        {
            name: 'glacial chain',
            description:
                'after using your non-utility skill you have a 25% chance to spell Frost Wave',
        },
        {
            name: 'red potion',
            description:
                'when you reach 1 life, your life is restored to full and you gain immortality for a short period',
        },
        {
            name: 'soul accumulator',
            description: 'when your teammate dies, you gain 5 to all stats',
        },
        {
            name: 'doom mantia',
            description:
                'when you take lethal damage, there is a chance to redirect your death to a nearby target',
        },
        {
            name: 'wall of bones',
            description:
                'if you get hit, you have a chance to receive a bone charge that increases your armor and fortification. If you reach the maximum charge (default 10), there is a chance that the charges will explode and injure enemies',
        },
        {
            name: 'flame ring',
            description: 'when you take damage, the nearest enemy takes damage',
        },
        {
            name: 'sparkling helmet',
            description: 'if you do not use any skills for 5 seconds, creates a shock ring',
        },
        {
            name: 'glass sword',
            description: 'always deal double damage, always take double damage',
        },
        {
            name: 'cloak',
            description: 'gives a chance to gain phasing when taking damage',
        },
        {
            name: 'staff',
            description: 'reduces cooldowns',
        },
        {
            name: 'charged bow',
            description: 'after hit enemy there is a chance to create lightnings with 2000 ms cd',
        },
        {
            name: 'dagger of smoke',
            description: 'when you heal, there is a chance to create blood shards',
        },
        {
            name: 'yellow stone',
            description: 'increases a chance to resist status, when you resist gain a ward',
        },
        {
            name: 'white shield',
            description: 'you have a chance to get ward when block',
        },
        {
            name: 'emerald knife',
            description: 'increase a chance to get additional gold',
        },
        {
            name: 'whispering shield',
            description: 'increases a chance to block and... whispers strange things sometimes',
        },
        {
            name: 'twilight gloves',
            description: 'periodically create clots of energy on enemies',
        },
        {
            name: 'ring of transmutation',
            description: 'when hitted by enemy there is a chance turn them into gold',
        },
        {
            name: 'sword handle',
            description: 'you are lucky',
        },
        {
            name: 'ice belt',
            description: 'increases maximum of energy',
        },
        {
            name: 'searching heart',
            description:
                'every 10 seconds releases fireballs, the number of which depends on the health lost during this time',
        },
        {
            name: 'charged armour',
            description:
                'when you get energy there is a chance that if it is not max - you get a ward, otherwise you lose the whole ward and get set on fire',
        },
        {
            name: 'molten helm',
            description:
                'when you start blocking you ignite enemies within a radius, the power of the burn depends on your armor. it has a 15-second cooldown',
        },
        {
            name: 'soul blade',
            description: 'when you kill enemy there is a chance to get ward',
        },
        {
            name: 'solar spear',
            description: 'when you pierce enemy you create light nova which heals allies',
        },
        {
            name: 'crystal greaves',
            description:
                'You are fragile while you stand, nearby enemies are frigile when you move',
        },
        {
            name: 'flying shards',
            description:
                'When you block hit with armour there is a chance to realise metal shards to enemies',
        },
        {
            name: 'pale blade',
            description:
                'when you hit enemy there is a chance to summon spectral blade which will fight on you side',
        },
        {
            name: 'crossbow',
            description: 'when you lead critical damage there is a chance to crush nearby enemies',
        },
        {
            name: 'royal mace',
            description: 'increases impact, crushing and critical rating',
        },
        {
            name: 'devouring axe',
            description: 'give you a chance to get devouring after kill',
        },
        {
            name: 'flamy nimbus',
            description: 'when you get maximum energy create a ring that burn enemies',
        },
        {
            name: 'distorter',
            description: 'gives 5% chance that a trigger triggered twice',
        },
    ]

    static forging_list_all = [
        'critical',
        'pierce',
        'sacredness',
        'toughness',
        'gold find',
        // 'charisma',
        'impact',
        'penetrating',
        'spirit',
        'power',
        'vampiric',
    ]

    static forging_list_type_1 = [
        'attack speed',
        'might',
        'durability',
        'instant kill',
        'when critical',
        'ignite when hit',
        'frost shpere when kill',
        'stun when hit',
        'thunder strikes',
        'storm presence',
        'dominance when critical',
        'fragility on hit'
    ]

    static forging_list_type_2 = [
        'armour rate',
        'perception',
        'agility',
        'regen time',
        'block chance',
        'when hit',
        'freeze when hited',
        'sparks when block',
        'shock nova when armour',
        'explosive armour',
        'fire presence',
        'fortify when hit',
        'enchanted armour'
    ]

    static forging_list_type_3 = [
        'resist',
        'will',
        'knowledge',
        'max resources',
        'cooldown reduction',
        'blessed life',
        'cast speed',
        'lightning when use skill',
        'overcharge',
        'ice presence',
        'cold heart',
    ]

    name: string = ''

    constructor() {}

    getSpecialForgings(): string[] | [] {
        return []
    }

    abstract equip(character: Character): void

    // abstract forge(character: Character): void

    canBeForged(character: Character) {
        return true
    }

    setPlayer(player: Character) {
        this.player = player
        this.equip(this.player)
    }

    disable() {
        this.disabled = true
    }

    enable() {
        this.disabled = false
    }

    pick(id: number) {
        let forging = this.suggested_forgings[id]

        this.player.gold += forging.gold_cost
        forging.forge(this.player)

        this.forge.push(forging)
    }

    public unlockForgings(): boolean {
        if (this.forge.length >= this.max_forgings) return false
        if (this.suggested_forgings.length != 0) return false

        let count = 5 - this.forge.length

        if(count < 2){
            count = 2
        }

        for (let i = 0; i < count; i++) {
            let f = this.getRandomForging()
            if (this.suggested_forgings.some(elem => elem.name === f.name)) {
                i--
            } else {
                this.suggested_forgings.push(f)
            }
        }

        return true
    }

    getRandomForging() {
        let all = [...Item.forging_list_all]

        if (this.type === 1) {
            all = all.concat(...Item.forging_list_type_1)
        } else if (this.type === 2) {
            all = all.concat(...Item.forging_list_type_2)
        } else if (this.type === 3) {
            all = all.concat(...Item.forging_list_type_3)
        }

        all = all.concat(...this.getSpecialForgings())

        let random: string = all[Math.floor(Math.random() * all.length)]

        let forging = Builder.createForging(random, this)

        while (this.forge.some(elem => elem instanceof forging.constructor)) {
            random = all[Math.floor(Math.random() * all.length)]

            forging = Builder.createForging(random, this)
        }

        return forging
    }
}
