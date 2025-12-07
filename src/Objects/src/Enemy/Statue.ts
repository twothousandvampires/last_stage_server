import Func from '../../../Func'
import Level from '../../../Level'
import EnemyCastState from '../../../State/EnemyCastState'
import { MagicStar } from '../../Projectiles/MagicStar'
import Enemy from './Enemy'

export default class Statue extends Enemy {
    constructor(level: Level) {
        super(level)
        this.name = 'statue'
        this.box_r = 3
        this.create_chance = 0
        this.count_as_killed = false
        this.can_be_instant_killed = false
        this.can_be_burned = false
        this.immune_to_freeze = true
        this.immune_to_stun = true
        this.immune_to_zap = true
        this.can_be_damaged = false
    }

    checkPlayer() {
        if (this.can_check_player) {
            let box = this.getBoxElipse()
            box.r += 2
            let target = this.level.players.filter(elem =>
                Func.elipseCollision(elem.getBoxElipse(), box)
            )[0]

            if (target) {
                let a = Func.angle(this.x, this.y, target.x, target.y)
                let count = 5
                let zone_per_tooth = 0.2

                a -= Math.round(count / 2) * zone_per_tooth

                for (let i = 1; i <= count; i++) {
                    let min_a = a + (i - 1) * zone_per_tooth
                    let max_a = a + i * zone_per_tooth

                    let angle = Math.random() * (max_a - min_a) + min_a
                    let proj = new MagicStar(this.level)
                    proj.setAngle(angle)
                    proj.setPoint(this.x, this.y)

                    this.level.projectiles.push(proj)
                }

                this.setState(new EnemyCastState())

                this.can_check_player = false

                setTimeout(() => {
                    this.can_check_player = true
                }, 1500)
            }
        }
    }
}
