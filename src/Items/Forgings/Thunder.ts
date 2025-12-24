import Character from '../../Objects/src/Character'
import ThunderTrigger from '../../Triggers/ThunderTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class Thunder extends Forging {

    value: number = 0
    trigger: any = undefined

    constructor(item: Item) {
        super(item)
        this.max_value = 100
        this.name = 'thunder'
        this.description = 'realises a thunder that deal damage in radius and creates sparks, trigger type and chance depends on item type'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {

            if (!this.trigger) {
                this.trigger = new ThunderTrigger()

                if(this.item.type === 1){
                    this.trigger.chance = 7
                    this.value = 7
                    this.max_value = 7
                    player.triggers_on_hit.push(this.trigger)
                }
                else if(this.item.type === 2){
                    this.trigger.chance = 15
                    this.value = 15
                    this.max_value = 15
                    player.triggers_on_block.push(this.trigger)
                }
                else if(this.item.type === 3){
                    this.trigger.chance = 10
                    this.value = 10
                    this.max_value = 10
                    player.triggers_on_lose_life.push(this.trigger)
                }            
            }
            else{
                if(this.item.type === 1){
                    this.trigger.chance += 7
                    this.value += 7
                }
                else if(this.item.type === 2){
                    this.trigger.chance += 15
                    this.value += 15
                }
                else if(this.item.type === 3){
                    this.trigger.chance += 10
                    this.value += 10
                } 
            }
        }
    }

    getValue() {
        return this.value + '%'
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}