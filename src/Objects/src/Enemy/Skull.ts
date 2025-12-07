import Func from '../../../Func'
import Level from '../../../Level'
import Undead from './Undead'

export default class Skull extends Undead {
    constructor(level: Level) {
        super(level)
        this.name = 'skull'
        this.box_r = 0.8
        this.move_speed = 0.2
        this.attack_radius = 1
        this.attack_speed = 1100
        this.cooldown_attack = 1200
        this.is_spawning = false
        this.create_grace_chance = 0
        this.create_entity_chance = 0
        this.create_energy_chance = 0
        this.gold_revard = 0
        this.create_chance = 0
        this.has_boby = false
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
        }
    }
}
