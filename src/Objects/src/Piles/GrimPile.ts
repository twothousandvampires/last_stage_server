import GrimPileCast from '../../../EnemyAbilities/GrimPileCast'
import Level from '../../../Level'
import Pile from './Pile'

export default class GrimPile extends Pile {
    increased_effect: boolean
    resistance: boolean

    constructor(
        level: Level,
        public power: number = 0
    ) {
        super(level)
        this.duration = 10000
        this.increased_effect = false
        this.resistance = false
        this.abilities = [new GrimPileCast(this.increased_effect, this.resistance)]
    }
}
