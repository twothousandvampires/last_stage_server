import Level from '../../../Level'
import ExplodingSkullIdleState from '../../../State/ExplodingSkullIdleState'
import Enemy from './Enemy'

export default class ExplodingSkull extends Enemy {
    target: any

    constructor(level: Level) {
        super(level)
        this.name = 'exploding skull'
        this.box_r = 1.2
        this.create_chance = 0
        this.count_as_killed = true
        this.can_be_burned = false
        this.immune_to_freeze = true
        this.immune_to_stun = true
        this.immune_to_zap = true
        this.life_status = 1
        this.has_boby = false
        this.is_spawning = false
        this.phasing = true
        this.move_speed = 0.3
    }

    getIdleStateInstance() {
        return new ExplodingSkullIdleState()
    }
}
