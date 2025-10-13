import Item from "../Items/Item"
import TemplateAbility from "../Types/TemplateAbility"

export default class characterTemplate{

    stats: any
    public name: string = ''
    stat_count: number = 5
    abilities: TemplateAbility[] = []
    item: Item[] = []
    max_items: number = 2
    stats_description: any

    constructor(){
        this.setTemplate()
    }
    
    setTemplate(class_name: string = 'swordman'): void{
        if(class_name === 'swordman'){
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
                might: `- affects the number of targets hit by your abilities
                        - affects the chance of not losing courage when receiving damage
                        - increases pierce rating`,
                agility: `- increases your attack speed
                          - reduces penalty of speed when your defend`,
                knowledge: `- gives a chance to get additional resource and courage
                            - increases status resistance`,
                will: `- increases your life regeneration rate
                       - increases the chance to skip damage state`,
                perception: `- increases a block chance
                             - reduses penalty of speed when you attacking
                             - increases maximum of energy`,
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
                    id: 10,
                    name: 'dash',
                    type: 1,
                    selected: false,
                    desc: 'makes a dash damaging enemies. The total distance is increased by attack speed'
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
                    id: 11,
                    name: 'metal thorns',
                    type: 2,
                    selected: false,
                    desc: 'Deals damage around you over time. The chance to deal damage depends on your arnour rating. The frequency of hits depends on your attack speed.'
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
                    desc: 'You jump and create 3 waves upon landing. This ability deals damage to YOU by defautl. The first one explodes enemies, the second one stuns them, and the third one slows them down. The radius depends on the might. After using it, you become weaker for 5 seconds.'
                },
                 {
                    id: 6,
                    name: 'heaven wrath',
                    type: 3,
                    selected: false,
                    desc: 'Get a 8 second buff that causes destruction to enemies if you have been hitting an enemy in the last 1.5 seconds. Strikes frequency depends on attack speed, duration is incresed by courage.'
                },
                {
                    id: 9,
                    name: 'spectral swords',
                    type: 3,
                    selected: false,
                    desc: 'Summons 5 swords that fight by your side and have your attack speed.'
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
                {
                    id: 8,
                    name: 'inner power',
                    type: 5,
                    selected: true,
                    desc: 'when you near dead, get a strong buff to help you survive. has long cd'
                },
                {
                    id: 8,
                    name: 'heaven intervention',
                    type: 5,
                    selected: false,
                    desc: 'when you get damage there is a chance that heaven will help you'
                },
            ]
        }
        else if(class_name === 'flyer'){
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
                might: `- affects the your abilities(increases AOE, number of projectiles etc.)
                        - reduces cooldowns`,
                agility: `- increases your armour rate
                          - increases your move speed`,
                knowledge: `- gives a chance not to pay mana when cast
                            - affect to start maximum mana pool`,
                will: `- gives a chance not to lose mana when block
                       - gives a chance to get additional mana`,
                perception: `- reduces penalty of speed when your cast
                             - gives a chance to get additional courage`,
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
                    id: 9,
                    name: 'sparks',
                    type: 3,
                    selected: false,
                    desc: 'Create a circle of frost. Enemies in close range will be shatered other will be frozen.'
                },
                {
                    id: 7,
                    name: 'teleportation',
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
                agility: 0,
                knowledge: 0,
                will: 1,
                perception: 0,
                durability: 2,
            }
            this.stats_description = {
                might: `- increases attack speed
                        - increases armour rate`,
                agility: `- increases your move speed
                          - increases block chance`,
                knowledge: `- gives a chance not to pay resource when cast
                            - increases your cast speed`,
                will: `- gives a chance to avoid damage
                       - increases status resist`,
                perception: `- increases chance to avoid damage state
                             - reduses cooldowns`,
                durability: `- increases spirit
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
                    id: 10,
                    name: 'soulrender',
                    type: 1,
                    selected: false,
                    desc: "tears the enemy, granting a soul charge, each soul charge increases cast speed. if you have more than one soul charge, there is a chance to tear the enemy apart and lose all soul charges."
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
                    id: 9,
                    name: 'wandering evil',
                    type: 3,
                    selected: false,
                    desc: 'Summons evil, which enters the being and after some time tears it apart.'
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