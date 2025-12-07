import EnemyBuilder from '../../../Classes/EnemyBuilder'
import Level from '../../../Level'
import EnemyTotemIdleState from '../../../State/EnemyTotemIdleState'
import Enemy from '../Enemy/Enemy'

export default class Pile extends Enemy {
    duration: number
    created: number = 0
    cast_time: number

    constructor(level: Level) {
        super(level)
        this.name = 'pile'
        this.box_r = 2
        this.move_speed = 0
        this.spawn_time = 1000
        this.life_status = 2
        this.duration = 12000
        this.cast_time = 2000
        this.cooldown_attack = 0
        this.abilities = [EnemyBuilder.getRanromEnemyAbility(3000)]
    }

    getIdleStateInstance() {
        return new EnemyTotemIdleState()
    }
}
