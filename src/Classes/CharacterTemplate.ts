type ability = {
    name: string,
    selected: boolean,
    type: number,
    id: number,
    desc: string
}
export default class characterTemplate{

    stats: any
    name: string
    stat_count: number
    abilities: ability[]
    item: string | undefined
    stats_description: any
    constructor(){
        this.setTemplate()
    }

    setTemplate(class_name: string = 'swordman'): void{
        if(class_name === 'swordman'){
            this.name = 'swordman'
            this.stat_count = 3
            this.stats = {
                might: 1,
                speed: 0,
                knowledge: 0, 
                will: 0,
                agility: 0,
                durability: 1,
            }
            this.stats_description = {
                might: `- affects the number of targets hit by your abilities
                        - affects the chance of not losing courage when receiving damage`,
                speed: `- increases your attack speed
                        - reduses penalty of speed when you defend`,
                knowledge: `- gives a chance to get additional resource and courage`,
                will: `- increases your life regeneration rate
                       - increases the chance to skip damage state`,
                agility: `- increases a block chance
                          - reduces penalty of speed when your attcking`,
                durability: `- gives a chance to get a additional life while regen
                             - increases your armour rate`
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'swing',
                    type: 1,
                    selected: true,
                    desc: 'cuts nearby enemies.'
                },
                {
                    id: 2,
                    name: 'weapon throw',
                    type: 1,
                    selected: false,
                    desc: 'throw your weapon.'
                },
                {
                    id: 3,
                    name: 'jump',
                    type: 2,
                    selected: true,
                    desc: 'You jump. There is a minimum and maximum distance. Upon landing, you deal damage to units. While in the air you are immune to ground effects.'
                },
                {
                    id: 4,
                    name: 'charge',
                    type: 2,
                    selected: false,
                    desc: 'You dash forward, stunning everyone in your path.'
                },
                {
                    id: 5,
                    name: 'whirlwind',
                    type: 3,
                    selected: true,
                    desc: 'You spin your sword, dealing damage to everyone around you. High courage can give additinals spins'
                },
                {
                    id: 6,
                    name: 'quake',
                    type: 3,
                    selected: false,
                    desc: 'You jump and create 3 waves upon landing. The first one explodes enemies, the second one stuns them, and the third one slows them down. The radius depends on the might. After using it, you become weaker for 5 seconds.'
                },
                {
                    id: 7,
                    name: 'cursed weapon',
                    type: 4,
                    selected: true,
                    desc: 'Your weapon gains a cursed power, increasing attack speed and attack radius for 12 seconds. After this time, you will take damage. High courage gives a chance to avoid damage.'
                },
                {
                    id: 8,
                    name: 'commands',
                    type: 4,
                    selected: false,
                    desc: 'Grants nearby allies speed and armor for 12 seconds. Effect increases by courage.'
                },
            ]
        }
        else if(class_name === 'flyer'){
            this.name = 'flyer'
            this.stat_count = 3
            this.stats = {
                might: 1,
                speed: 0,
                knowledge: 2,
                will: 0,
                agility: 0,
                durability: 0,
            }
            this.stats_description = {
                might: 'increases power of your spells, aoe, count of targets etc.',
                speed: 'increases your move speed',
                knowledge: 'increases your mana pool',
                will: 'gives a chance to regen one more mana then regen tick',
                agility: 'reduces the move speed penalty then you cast a spell',
                durability: 'gives a chance not ot get damaged animation when hit'
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'fireball',
                    type: 1,
                    selected: true,
                    desc: 'Create a ball of flame. Explosion radius is icreased by might.'
                },
                {
                    id: 2,
                    name: 'frost sphere',
                    type: 1,
                    selected: false,
                    desc: 'Create a ball of ice. Explosion radius is icreased by might.'
                },
                {
                    id: 9,
                    name: 'lightning bolt',
                    type: 1,
                    selected: false,
                    desc: 'Create a pile of electricity. Deals damage to target. High might increses number of targets'
                },
                {
                    id: 3,
                    name: 'forked lightning',
                    type: 2,
                    selected: true,
                    desc: 'Create a forked electricity charge. When it deals damage it have chance to fork creating two new charges. High might increases the chance.'
                },
                {
                    id: 4,
                    name: 'flamewall',
                    type: 2,
                    selected: false,
                    desc: 'Create e ring of fire. High migth increases duration.'
                },
                {
                    id: 5,
                    name: 'light beacon',
                    type: 3,
                    selected: true,
                    desc: 'You fly up and share your vision also you create electricity charges. Frequency depends on your might.'
                },
                {
                    id: 6,
                    name: 'frost nova',
                    type: 3,
                    selected: false,
                    desc: 'Create a circle of frost. Enemies in close range will be shatered other will be frozen. Radius is increases by might.'
                },
                {
                    id: 7,
                    name: 'teleportaion',
                    type: 4,
                    selected: true,
                    desc: 'Teleports you in certain place. High will reduces cd.'
                },
                {
                    id: 8,
                    name: 'static field',
                    type: 4,
                    selected: false,
                    desc: 'Grants nearby allies speed and armor for 12 seconds. Effect increases with will.'
                },
            ]
        }
        else if(class_name === 'cultist'){
            this.name = 'cultist'
            this.stat_count = 3
            this.stats = {
                might: 0,
                speed: 0,
                knowledge: 0,
                will: 1,
                agility: 0,
                durability: 2,
            }
            this.stats_description = {
                might: 'increases power of your spells, aoe, count of targets etc.',
                speed: 'increases your move speed',
                knowledge: 'increases your mana pool',
                will: 'gives a chance to regen one more mana then regen tick',
                agility: 'reduces the move speed penalty then you cast a spell',
                durability: 'gives a chance not ot get damaged animation when hit'
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'slam',
                    type: 1,
                    selected: true,
                    desc: 'Create a ball of flame. Explosion radius is icreased by might.'
                },
                {
                    id: 2,
                    name: 'rune',
                    type: 1,
                    selected: false,
                    desc: 'Create a ball of flame. Explosion radius is icreased by might.'
                },
                {
                    id: 3,
                    name: 'shield bash',
                    type: 2,
                    selected: true,
                    desc: 'Create a forked electricity charge. When it deals damage it have chance to fork creating two new charges. High might increases the chance.'
                },
                {
                    id: 4,
                    name: 'grim pile',
                    type: 2,
                    selected: false,
                    desc: 'Create a forked electricity charge. When it deals damage it have chance to fork creating two new charges. High might increases the chance.'
                },
                {
                    id: 5,
                    name: 'unleash pain',
                    type: 3,
                    selected: true,
                    desc: 'Create a circle of frost. Enemies in close range will be shatered other will be frozen. Radius is increases by might.'
                },
                {
                    id: 6,
                    name: 'pile of thorns',
                    type: 3,
                    selected: false,
                    desc: 'Create a circle of frost. Enemies in close range will be shatered other will be frozen. Radius is increases by might.'
                },
                {
                    id: 7,
                    name: 'self flagellation',
                    type: 4,
                    selected: true,
                    desc: 'Grants nearby allies speed and armor for 12 seconds. Effect increases with will.'
                },
                {
                    id: 8,
                    name: 'ghost form',
                    type: 4,
                    selected: false,
                    desc: 'Grants nearby allies speed and armor for 12 seconds. Effect increases with will.'
                },
            ]
        }
    }

    increseStat(stat: string): void{
        if(this.stat_count > 0){
            this.stats[stat] ++
            this.stat_count --
        }
    }

    decreaseStat(stat: string): void{
        if(this.stats[stat] > 0){
            this.stats[stat] --
            this.stat_count ++
        }
    }
}