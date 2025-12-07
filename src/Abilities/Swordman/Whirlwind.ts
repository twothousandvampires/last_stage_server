import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Blood from '../../Objects/Effects/Blood'
import BloodSphere from '../../Objects/Effects/BloodSphere'
import { ThrowedWeapon } from '../../Objects/Projectiles/ThrowedWeapon'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'
import WeaponThrow from './WeaponThrow'

export default class Whirlwind extends SwordmanAbility implements IUnitState<Swordman> {
    cost: number
    blood_harvest: boolean
    fan_of_swords: boolean
    courage_when_use: number = 0

    constructor(owner: Swordman) {
        super(owner)
        this.cost = 7
        this.blood_harvest = false
        this.fan_of_swords = false
        this.name = 'whirlwind'
        this.type = Ability.TYPE_CUSTOM
        this.need_to_pay = true
        this.mastery_chance = 60
        this.cd = 4000
    }

    impact() {
        let enemies = this.owner.level.enemies
        let players = this.owner.level.players

        let targets = enemies.concat(players)

        let e = this.owner.getBoxElipse()
        e.r += this.owner.attack_radius + 1

        let was_hit = false

        let kill_count = 0

        targets.forEach(elem => {
            if (elem != this.owner && Func.elipseCollision(e, elem.getBoxElipse())) {
                was_hit = true
                elem.takeDamage(this.owner)
                if (elem.is_dead) {
                    kill_count++
                    for (let i = 0; i < 2; i++) {
                        let e = new Blood(this.owner.level)
                        e.setPoint(elem.x, elem.y)
                        this.owner.level.effects.push(e)
                    }
                }
            }
        })

        if (this.blood_harvest && kill_count > 0) {
            let chance = 20 * kill_count
            if (Func.chance(chance)) {
                let sphere = new BloodSphere(this.owner.level, kill_count)
                sphere.setPoint(this.owner.x, this.owner.y)
                this.owner.level.binded_effects.push(sphere)
            }
        }

        if (!was_hit) {
            this.owner.level.sounds.push({
                name: 'sword swing',
                x: this.owner.x,
                y: this.owner.y,
            })
        }

        if (this.fan_of_swords) {
            let count = this.owner.getTargetsCount()

            if (count > 15) {
                count = 15
            }

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new ThrowedWeapon(this.owner.level)

                if (this.owner.first_ability instanceof WeaponThrow) {
                    if (this.owner.first_ability.shattering) {
                        proj.shattered = true
                    } else if (this.owner.first_ability.returning) {
                        proj.returned = true
                    }
                }

                proj.setAngle(angle)
                proj.setPoint(this.owner.x, this.owner.y)
                proj.setOwner(this.owner)

                this.owner.level.projectiles.push(proj)
            }
        }
    }

    enter(player: Swordman) {
        player.prepareToAction()
        player.state = 'swing'

        let action_time = player.getAttackSpeed() / 2
        player.action_time = action_time
        player.setImpactTime(70)

        this.courage_when_use = player.getSecondResource()
    }

    update(unit: Swordman): void {
        if (unit.action && !unit.hit) {
            this.impact()
            unit.hit = true
        } else if (unit.action_is_end) {
            unit.action_is_end = false

            let proc = this.courage_when_use * 7

            if (proc > 80) {
                proc = 80
            }
            if (Func.chance(proc)) {
                unit.hit = false
                unit.action = false
                unit.setImpactTime(70)
            } else {
                this.afterUse()
                unit.getState()
            }
        }
    }

    exit(unit: Swordman): void {
        this.courage_when_use = 0
    }
}
