import Character from "../Objects/src/Character";

export default abstract class Item{
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
            description: 'when you reach 1 life restores your life to full, uses only one time'
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
            description: 'if you do not use any skills for 7 seconds it creates a shock ring'
        },
    ]

    abstract equip(character: Character): void
    abstract forge(character: Character): void

    canBeForged(character: Character){
        return true
    }
}