import Builder from "../Classes/Builder";
import Character from "../Objects/src/Character";
import Forging from "./Forgings/Forging";

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

    static list = [
        {
            name: "skull of first warrior",
            description: 'increases your might by 10 for 10 seconds after 10 kills'
        },
        {
            name: "glacial chain",
            description: 'after using your non-utility skill you have a 25% chance to spell Frost Wave'
        },
        {
            name: "red potion",
            description: 'when you reach 1 life, your life is restored to full and you gain immortality for a short period'
        },
        {
            name: "soul accumulator",
            description: 'when your teammate dies, you gain 5 to all stats'
        },
        {
            name: "doom mantia",
            description: 'when you take lethal damage, there is a chance to redirect your death to a nearby unit'
        },
        {
            name: "wall of bones",
            description: 'when you kill an enemy, your armor is increased by 1 for 10 seconds'
        },
        {
            name: "flame ring",
            description: 'when you take damage, the nearest enemy takes damage'
        },{
            name: "sparkling helmet",
            description: 'if you do not use any skills for 5 seconds it creates a shock ring'
        },
        {
            name: "glass sword",
            description: 'always deal double damage, always take double damage'
        },
        {
            name: "cloak",
            description: 'gives a chance to gain phasing when taking damage'
        },
        {
            name: "staff",
            description: 'gives a chance for the second skill not to be used after use'
        },
        {
            name: "charged bow",
            description: 'after hit enemy there is a chance to create lightnings with 2000 ms cd'
        },
        {
            name: "dagger of smoke",
            description: 'when you heal, there is a chance to create blood shards'
        },
        {
            name: "yellow stone",
            description: 'increases a chance to resist status, when you resist gain a ward'
        },
        {
            name: "white shield",
            description: 'you have a chance to get ward when block'
        },
        {
            name: "emerald knife",
            description: 'increase a chance to get additional gold'
        },
        {
            name: "whispering shield",
            description: 'increases a chance to block and... whispers strange things sometimes'
        },
    ]

    static forging_list_all = [
        'critical',
        'pierce',
    ]

    static forging_list_type_1 = [
        'attack speed',
        'might',
        'durability',
        'cast speed'
    ]

    static forging_list_type_2 = [
        'armour rate',
        'speed',
        'agility',
        'regen time',
        'block chance'
    ]
    
    static forging_list_type_3 = [
        'resist',
        'will',
        'knowledge',
        'max resources',
        'gold find'
    ]


    name: string = ''

    constructor(){

    }

    getSpecialForgings(): string[] | []{
        return []
    }

    abstract equip(character: Character): void

    // abstract forge(character: Character): void

    canBeForged(character: Character){
        return true
    }

    setPlayer(player: Character){
        this.player = player
        this.equip(this.player)
    }

    public unlockForging(): boolean{
        if(this.forge.length >= this.max_forgings) return false

        let forging: Forging = this.getRandomForging()

        forging.forge(this.player)

        this.player.gold += forging.gold_cost

        this.forge.push(forging)

        return true
    }

    getRandomForging(){
        let all = [...Item.forging_list_all]
        
        if(this.type === 1){
            all = all.concat(...Item.forging_list_type_1)
        }
        else if(this.type === 2){
            all = all.concat(...Item.forging_list_type_2)
        }
        else if(this.type === 3){
             all = all.concat(...Item.forging_list_type_3)
        }

        all =  all.concat(...this.getSpecialForgings())

        let random: string = all[Math.floor(Math.random() * all.length)]

        let forging = Builder.createForging(random, this)

        while(this.forge.some(elem => elem instanceof forging.constructor)){
            random = all[Math.floor(Math.random() * all.length)]

            forging = Builder.createForging(random, this)
        }

        return forging
    }
}