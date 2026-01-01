import Character from '../../Objects/src/Character'
import ShockWaveTrigger from '../../Triggers/ShockWaveTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class ShockWave extends Forging {

    value: number = 0
    trigger: any = undefined

    constructor(item: Item | undefined) {
        super(item)
        this.max_value = 100
        this.name = 'shock wave'
        this.description = 'After using the ability, there is a chance to create 10 strikes around you that deal damage, the radius is chosen randomly'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {
            if (!this.trigger) {
                this.trigger = new ShockWaveTrigger()
       
                this.trigger.chance = 4
                this.value = 4
                this.max_value = 4
                player.triggers_on_use_not_utility.push(this.trigger)                            
            }
            else{          
                this.trigger.chance += 4
                this.value += 4
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