import Func from '../../../Func'
import Level from '../../../Level'
import Bleed from '../../../Status/Bleed'
import Enemy from './Enemy'

export default class Impy extends Enemy {
    constructor(level: Level) {
        super(level)
        this.name = 'impy'
        this.box_r = 2
        this.move_speed = 0.26
        this.attack_radius = 4.5
        this.attack_speed = 1400
        this.cooldown_attack = 1800
        this.spawn_time = 1000
        this.say_z = 8
        this.weapon_angle = 0.7
    }

    hitImpact() {
        if (!this.target || !this.attack_angle) return

        let e = this.getBoxElipse()
        e.r = this.attack_radius

        if (
            this.target.z < 5 &&
            Func.elipseCollision(e, this.target.getBoxElipse()) &&
            Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)
        ) {
            this.target.takeDamage(this, {})

            if (Func.chance(30)) {
                this.level.sounds.push({
                    x: this.x,
                    y: this.y,
                    name: 'impy',
                })
            }

            if (Func.chance(5)) {
                let status = new Bleed(this.level.time)
                status.setDuration(4000)
                this.level.setStatus(this.target, status)
            }
        }
    }
}
