import Func from '../../../Func'
import Level from '../../../Level'
import EnemyDyingState from '../../../State/EnemyDyingState'
import Character from '../Character'
import Enemy from '../Enemy/Enemy'

export default class SpectralSword extends Enemy {
    weapon_angle: number
    target: any
    created: number = Date.now()

    constructor(
        level: Level,
        private ttl: number = 12000,
        creator: Character
    ) {
        super(level)
        this.name = 'spectral sword'
        this.box_r = 2
        this.move_speed = 0.25
        this.attack_radius = 6.5
        this.attack_speed = creator.getAttackSpeed()
        this.spawn_time = 1000
        this.say_z = 8
        this.weapon_angle = 0.9
        this.create_chance = 2
        this.count_as_killed = false
        this.phasing = true
        this.player_check_radius = 25
        this.life_status = creator.life_status
        this.has_boby = false
    }

    hitImpact() {
        if (!this.target || !this.attack_angle) return

        let e = this.getBoxElipse()
        e.r = this.attack_radius

        if (
            this.target?.z < 5 &&
            Func.elipseCollision(e, this.target?.getBoxElipse()) &&
            Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)
        ) {
            this.target?.takeDamage(undefined)
        }
    }

    checkPlayer(): void {
        if (this.level.time - this.created >= this.ttl) {
            this.is_dead = true
            this.setState(new EnemyDyingState())
            return
        }
        if (this.can_check_player) {
            if (!this.target) {
                this.can_check_player = false

                let p = this.level.enemies.filter(
                    elem =>
                        !(elem instanceof SpectralSword) &&
                        Func.distance(this, elem) <= this.player_check_radius &&
                        !elem.is_dead &&
                        elem.z < 5
                )

                if (p.length) {
                    this.target = p[Math.floor(Math.random() * p.length)]
                } else {
                    this.target = undefined
                }
            } else {
                if (
                    Func.distance(this, this.target) > this.player_check_radius ||
                    this.target.is_dead
                ) {
                    this.target = undefined
                }
            }

            setTimeout(() => {
                this.can_check_player = true
            }, 2000)
        }
    }
}
