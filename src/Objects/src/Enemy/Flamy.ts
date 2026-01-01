import Func from '../../../Func'
import Level from '../../../Level'
import EnemyRangeIdleState from '../../../State/EnemyRangeIdleState'
import { FlamyFireBall } from '../../Projectiles/FlamyFireBall'
import Enemy from './Enemy'

export class Flamy extends Enemy {
    cooldown_attack: number = 4000

    constructor(level: Level) {
        super(level)
        this.name = 'flamy'
        this.box_r = 2
        this.move_speed = 0.3
        this.attack_radius = 5
        this.attack_speed = 2000
        this.retreat_distance = 10
        this.spawn_time = 1400
        this.player_check_radius = 25
        this.say_z = 8
        this.gold_revard = 2
    }

    getIdleStateInstance() {
        return new EnemyRangeIdleState()
    }

    hitImpact() {
        if (this.target) {
            let fb = new FlamyFireBall(this.level)
            fb.setPoint(this.x, this.y)

            fb.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
            fb.setOwner(this)
            fb.setPoint(this.x, this.y)

            this.level.projectiles.push(fb)
        }
    }

    deadSound(): void {
        if (Func.notChance(15)) return

        this.level.sounds.push({
            x: this.x,
            y: this.y,
            name: 'flamy dead',
        })
    }
}
