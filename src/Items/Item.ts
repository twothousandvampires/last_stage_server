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

    static list = [
        {
            name: "skull of first warrior",
            description: 'increases your might by 10 for 10 seconds after 10 kills'
        },
        {
            name: "glacial chain",
            description: 'after using your not utility skill you have 25% chance to spell frost nova'
        },
        {
            name: "red potion",
            description: 'when you reach 1 life restores your life to full and get immortality for short periodR, uses only one time'
        },
        {
            name: "soul accumulator",
            description: 'when you teammate dies you get 5 to all stats'
        },
        {
            name: "doom mantia",
            description: 'if you take lethal damage, there is a chance to redirect your death to nearest creature'
        },
        {
            name: "wall of bones",
            description: 'when you kill enemy you increase u armour by 1 for 10 seconds'
        },
        {
            name: "flame ring",
            description: 'when you recive damage nearest enemy take damage'
        },{
            name: "sparkling helmet",
            description: 'if you do not use any skills for 5 seconds it creates a shock ring'
        },
        {
            name: "glass sword",
            description: 'always deal double damage, always get double damage'
        },
        {
            name: "cloak",
            description: 'gives a chance to get phasing when get hit'
        },
        {
            name: "staff",
            description: 'gives a chance for second skill not to be used after use'
        },
        {
            name: "charged bow",
            description: 'after hit enemy there is a chance to create up to 3(depends on forge level) lightnings with 2000 ms cd'
        },
        {
            name: "dagger of smoke",
            description: 'when you are healed there is a chance to create blood shards the amount of which is based on the number of enemies in a small radius'
        },
        {
            name: "yellow stone",
            description: 'increases chance to resist status, when you resist gain a ward'
        },
        {
            name: "white shield",
            description: 'you have a chance to get ward when block'
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
        'regen time'
    ]
    
    static forging_list_type_3 = [
        'resist',
        'will',
        'knowledge',
        'max resources'
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

    unlockForging(){
        if(this.forge.length >= this.max_forgings) return

        let forging: Forging = this.getRandomForging()

        forging.forge(this.player)

        this.forge.push(forging)
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