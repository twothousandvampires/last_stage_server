import Character from '../../Objects/src/Character'
import Item from '../Item'

export default abstract class Forging {

    description: string | undefined
    max_value: number = 0
    gold_cost: number = 1
    name: string = ''
    value: number = 0

    constructor(protected item: Item | undefined) {}

    abstract forge(player: Character | undefined): void
    
    getValue(): string | number{
        return this.value
    }

    costEnough() {
        if (!this.item) return false
        if (!this.item.player) return false

        return this.item.player.gold >= this.gold_cost
    }

    setItem(item: Item){
        this.item = item
    }

    payCost() {
        if (!this.item) return
        if (!this.item.player) return

        this.item.player.gold -= this.gold_cost
        this.item.player.carved_sparks ++
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
