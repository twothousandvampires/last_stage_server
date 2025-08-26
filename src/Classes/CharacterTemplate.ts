import TemplateAbility from "../Types/TemplateAbility"

export default class characterTemplate{

    stats: any
    name: string
    stat_count: number
    abilities: TemplateAbility[] = []
    item: string | undefined
    stats_description: any
    item_description: any

    constructor(){
        this.setTemplate()
    }
    
    setTemplate(class_name: string = 'swordman'): void{
        if(class_name === 'swordman'){
            this.name = 'swordman'
            this.stat_count = 5
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
                knowledge: `- gives a chance to get additional resource and courage
                            - increases status resistance`,
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
            this.stat_count = 5
            this.stats = {
                might: 1,
                speed: 0,
                knowledge: 2,
                will: 0,
                agility: 0,
                durability: 0,
            }
            this.stats_description = {
                might: `- affects the your abilities(increases AOE, number of projectiles etc.)`,
                speed: `- increases your move speed
                        - gives a chance to get additional courage`,
                knowledge: `- gives a chance not to pay mana when cast
                            - affect to start maximum mana pool`,
                will: `- gives a chance not to lose mana when block
                       - gives a chance to get additional mana`,
                agility: `- increases your armour rate
                          - reduces penalty of speed when your cast`,
                durability: `- gives a chance to avoid damage state
                             - increases life regen rate`
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'fireball',
                    type: 1,
                    selected: true,
                    desc: 'Create a ball of flame.'
                },
                {
                    id: 2,
                    name: 'frost sphere',
                    type: 1,
                    selected: false,
                    desc: 'Create a sphere of ice.'
                },
                {
                    id: 9,
                    name: 'lightning bolt',
                    type: 1,
                    selected: false,
                    desc: 'Create a pile of electricity. Deals damage to one arget and shocks closest.'
                },
                {
                    id: 3,
                    name: 'forked lightning',
                    type: 2,
                    selected: true,
                    desc: 'Create a forked electricity charge. When it deals damage it have chance to fork creating two new ones.'
                },
                {
                    id: 4,
                    name: 'flamewall',
                    type: 2,
                    selected: false,
                    desc: 'Create e ring of fire.'
                },
                {
                    id: 5,
                    name: 'light beacon',
                    type: 3,
                    selected: true,
                    desc: 'You fly up and share your vision also you create electricity charges.'
                },
                {
                    id: 6,
                    name: 'frost nova',
                    type: 3,
                    selected: false,
                    desc: 'Create a circle of frost. Enemies in close range will be shatered other will be frozen.'
                },
                {
                    id: 7,
                    name: 'teleportaion',
                    type: 4,
                    selected: true,
                    desc: 'Teleports you in certain place.'
                },
                {
                    id: 8,
                    name: 'static field',
                    type: 4,
                    selected: false,
                    desc: 'units and projectiles cannot move in static field.'
                },
            ]
        }
        else if(class_name === 'cultist'){
            this.name = 'cultist'
            this.stat_count = 5
            this.stats = {
                might: 0,
                speed: 0,
                knowledge: 0,
                will: 1,
                agility: 0,
                durability: 2,
            }
            this.stats_description = {
                 might: `- increases attack speed
                         - increases armour rate`,
                speed: `- increases your cast speed
                        - increases life regen rate`,
                knowledge: `- gives a chance not to pay resource when cast
                            - reduces courage lose rate`,
                will: `- gives a chance to avoid damage
                       - increases status resist`,
                agility: `- increases move speed
                          - increases chance to avoid damage state`,
                durability: `- increases block chance
                             - gives a chance to get additional resourse`
            }
            this.abilities = [
                {
                    id: 1,
                    name: 'slam',
                    type: 1,
                    selected: true,
                    desc: 'slam the ground and deals damage to nearest targets.'
                },
                {
                    id: 2,
                    name: 'rune',
                    type: 1,
                    selected: false,
                    desc: 'create explosive rune.'
                },
                {
                    id: 3,
                    name: 'shield bash',
                    type: 2,
                    selected: true,
                    desc: 'hit with your shield. deal damage to closest targets and bash the farest'
                },
                {
                    id: 4,
                    name: 'grim pile',
                    type: 2,
                    selected: false,
                    desc: 'create a pile of bones which periodicly increase armour rate and move speed to you and your teammates.'
                },
                {
                    id: 5,
                    name: 'unleash pain',
                    type: 3,
                    selected: true,
                    desc: 'summon a ghost warriors which will hit enemies.'
                },
                {
                    id: 6,
                    name: 'pile of thorns',
                    type: 3,
                    selected: false,
                    desc: 'create a pile of bones which periodicly damage enemies around it'
                },
                {
                    id: 7,
                    name: 'self flagellation',
                    type: 4,
                    selected: true,
                    desc: 'deals damage to you.'
                },
                {
                    id: 8,
                    name: 'ghost form',
                    type: 4,
                    selected: false,
                    desc: 'become into shost form getting immune to damage and phasing.'
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