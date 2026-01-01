import EarthSpikes from '../../../EnemyAbilities/EarthSpikes'
import FlyingRock from '../../../EnemyAbilities/FlyingRock'
import Func from '../../../Func'
import Level from '../../../Level'
import Enemy from './Enemy'

export default class BindedRocks extends Enemy {
 
    constructor(level: Level) {
        super(level)
        this.name = 'binded rocks'
        this.box_r = 3.5
        this.move_speed = 0.22
        this.attack_radius = 7.5
        this.attack_speed = 2000
        this.spawn_time = 1200
        this.life_status = 6
        this.armour_rate = 25
        this.create_grace_chance = 90
        this.pierce = 40
        this.cooldown_attack = 3500
        this.create_chance = 80
        this.say_z = 20
        this.gold_revard = 4
        this.create_item_chance = 4
        this.dead_time = 1200
        this.abilities = [new EarthSpikes(), new FlyingRock()]
        this.elemental_status_resist = 30
        this.can_be_burned = false
        this.immune_to_zap = true
        this.immune_to_stun = true
        this.wave_start = 150
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
