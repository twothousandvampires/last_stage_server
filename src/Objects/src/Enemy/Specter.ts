import SoulSeekers from '../../../EnemyAbilities/SoulSeekers'
import SoulVortex from '../../../EnemyAbilities/SoulVortex'
import Func from '../../../Func'
import Level from '../../../Level'
import Undead from './Undead'

export default class Specter extends Undead {
    ressurect_chance: number
    want_to_cast: boolean
    spell_name: string | undefined
    can_cast_vortex: boolean
    can_cast_seekers: boolean

    constructor(level: Level) {
        super(level)
        this.name = 'specter'
        this.box_r = 2.5
        this.move_speed = 0.05
        this.cooldown_attack = 2000
        this.attack_radius = 7
        this.attack_speed = 2000
        this.life_status = 4
        this.spawn_time = 1600
        this.ressurect_chance = 30
        this.armour_rate = 50
        this.want_to_cast = true
        this.can_cast_vortex = true
        this.can_cast_seekers = true
        this.create_grace_chance = 90
        this.create_chance = 90
        this.gold_revard = 5
        this.create_item_chance = 6
        this.pierce = 20

        this.abilities = [new SoulVortex(), new SoulSeekers()]
    }

    deadSound(): void {
        if (Func.notChance(15)) return

        this.level.sounds.push({
            x: this.x,
            y: this.y,
            name: 'specter dead',
        })
    }

    getCastStateString() {
        return 'cast'
    }

    hitImpact() {
        if (this.target && this.attack_angle) {
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'specter attack',
            })

            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if (
                this.target.z < 5 &&
                Func.checkAngle(this, this.target, this.attack_angle, 1.6) &&
                Func.elipseCollision(e, this.target?.getBoxElipse())
            ) {
                this.target.takeDamage(this, {})
            }
        }
    }
}
