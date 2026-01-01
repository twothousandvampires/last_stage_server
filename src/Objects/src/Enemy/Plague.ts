import PlagueBomb from '../../../EnemyAbilities/PlagueBomb'
import SwirlingMucus from '../../../EnemyAbilities/SwirlingMucus'
import Func from '../../../Func'
import Level from '../../../Level'
import EnemyRangeIdleState from '../../../State/EnemyRangeIdleState'
import { PoisonousBone } from '../../Projectiles/PoisonousBone'
import Undead from './Undead'

export default class Plague extends Undead {

    retreat_angle: any
    ressurect_chance: number

    constructor(level: Level) {
        super(level)
        this.name = 'plague'
        this.box_r = 2.2
        this.move_speed = 0.2
        this.attack_radius = 6
        this.attack_speed = 1600
        this.cooldown_attack = 3000
        this.life_status = 3
        this.spawn_time = 1600
        this.create_grace_chance = 40
        this.create_chance = 70
        this.ressurect_chance = 0
        this.gold_revard = 4
        this.create_item_chance = 2
        this.create_sorcerers_skull_chance = 5
        this.retreat_distance = 7
        this.abilities = [
           new PlagueBomb(),
           new SwirlingMucus()
        ]
        this.wave_start = 100
    }

    hitImpact(): void {
        if (this.target) {
            let fb = new PoisonousBone(this.level)
            fb.setPoint(this.x, this.y)

            fb.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
            fb.setOwner(this)
            fb.setPoint(this.x, this.y)

            this.level.projectiles.push(fb)
        }
    }

    getIdleStateInstance() {
        return new EnemyRangeIdleState()
    }

    castImpact(): void {
        if (Func.chance(30)) {
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'flying bones cast',
            })
        }
    }
}