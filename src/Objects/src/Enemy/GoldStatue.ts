import Level from '../../../Level'
import Enemy from './Enemy'

export default class GoldStatue extends Enemy {
    constructor(level: Level) {
        super(level)
        this.name = 'gold statue'
        this.box_r = 3
        this.create_chance = 0
        this.count_as_killed = true
        this.can_be_instant_killed = false
        this.can_be_burned = false
        this.immune_to_freeze = true
        this.immune_to_stun = true
        this.immune_to_zap = true
        this.life_status = 15
        this.has_boby = false
    }
}
