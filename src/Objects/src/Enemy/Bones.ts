import EnemyBuilder from '../../../Classes/EnemyBuilder'
import Func from '../../../Func'
import Level from '../../../Level'
import Poison from '../../../Status/Poison'
import Undead from './Undead'

export default class Bones extends Undead {
    constructor(level: Level) {
        super(level)
        this.name = 'bones'
        this.box_r = 2.2
        this.move_speed = 0.15
        this.attack_radius = 5
        this.attack_speed = 1500
        this.cooldown_attack = 2200
        this.life_status = 1
        this.spawn_time = 1600
        this.ressurect_chance = 60
        this.armour_rate = 5
        this.gold_revard = 2
        this.weapon_angle = 0.8
    }

    whenDead(): void {
        let skull = EnemyBuilder.createEnemy('skull', this.level)
        skull.setPoint(this.x, this.y)

        this.level.enemies.push(skull)
    }

    hitImpact() {
        if (!this.target || !this.attack_angle) return

        this.level.sounds.push({
            x: this.x,
            y: this.y,
            name: 'short sword swing',
        })

        let e = this.getBoxElipse()
        e.r = this.attack_radius

        if (
            this.target?.z < 5 &&
            Func.elipseCollision(e, this.target?.getBoxElipse()) &&
            Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)
        ) {
            this.target.takeDamage(this, {})

            if (Func.chance(25)) {
                let status = new Poison(Date.now())
                status.setDuration(6000)
                this.level.setStatus(this.target, status)
            }
        }
    }
}
