import Func from '../../Func'
import Character from '../../Objects/src/Character'
import Item from '../Item'

export default abstract class Forging {

    description: string | undefined
    max_value: number = 0
    gold_cost: number = 1
    name: string = ''
    value: number = 0
    consumable: boolean = false

    constructor(protected item: Item | undefined) {}

    forge(player: Character | undefined, force: boolean = false): void{

    }
    
    getValue(): string | number{
        return this.value
    }

    costEnough() {
        if (!this.item) return false
        if (!this.item.player) return false

        return this.item.player.gold >= this.gold_cost
    }

    setItem(item: Item| undefined){
        this.item = item
    }

    payCost() {
        if (!this.item) return
        if (!this.item.player) return

        this.item.player.gold -= this.gold_cost
        this.item.player.carved_sparks += Func.random(1, 4)
        
        if(Func.chance(this.item.player.chance_to_additional_carved_spark)){
            this.item.player.carved_sparks ++
        }
    }

    toJSON() {
        return {
            description: this.description,
            max: this.max_value,
            value: this.getValue(),
            can: this.canBeForged() && this.costEnough(),
            cost: this.gold_cost,
            name: this.name,
        }
    }

    canBeForged() {
        return false
    }
}
