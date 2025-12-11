import Func from '../../Func'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import ImprovedSwingTechnology from '../../Status/ImprovedSwingTechnology'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class WeaponSwing extends SwordmanAbility {
    echo_swing: boolean = false
    improved_swing_technology: boolean = false
    crushing: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.name = 'swing'
        this.type = Ability.TYPE_ATTACK
        this.mastery_chance = 5
    }

    impact() {
        let enemies = this.owner.level.enemies
        let players = this.owner.level.players

        let second = this.owner.getSecondResource()

        let attack_elipse = this.owner.getBoxElipse()
        attack_elipse.r = this.owner.attack_radius

        let attack_angle = this.owner.attack_angle

        if (this.crushing) {
            attack_elipse.r += 3
        }

        let weapon_angle = this.owner.weapon_angle + (second / 10)

        if (this.crushing) {
            weapon_angle += 0.5
        }

        let f = enemies
            .concat(players)
            .filter(
                elem =>
                    elem != this.owner &&
                    Func.checkAngle(this.owner, elem, attack_angle, weapon_angle)
            )
        let filtered_by_attack_radius = f.filter(elem =>
            Func.elipseCollision(attack_elipse, elem.getBoxElipse())
        )
        filtered_by_attack_radius.sort(
            (a, b) => Func.distance(a, this.owner) - Func.distance(b, this.owner)
        )

        let target = this.owner.getTarget()

        let hit_count = this.owner.getTargetsCount()

        let point_added = false

        if (target) {
            filtered_by_attack_radius.unshift(target)
        }

        filtered_by_attack_radius = filtered_by_attack_radius.slice(0, hit_count)

        filtered_by_attack_radius.forEach(elem => {
            elem.takeDamage(this.owner)
            this.owner.addPoint()
        })

        if (!point_added) {
            this.owner.level.sounds.push({
                name: 'sword swing',
                x: this.owner.x,
                y: this.owner.y,
            })
        } else {
            if (this.improved_swing_technology && Func.chance(30)) {
                let status = new ImprovedSwingTechnology(this.owner.level.time)
                status.setDuration(5000)

                this.owner.level.setStatus(this.owner, status, true)
            }
        }

        this.afterUse()
        if (this.echo_swing && attack_angle) {
            this.echo(40, attack_angle, attack_elipse, weapon_angle)
        }
    }

    echo(chance: number = 0, attack_angle: number, attack_elipse: any, weapon_angle = 1) {
        if (!Func.chance(chance)) return

        setTimeout(() => {
            attack_elipse.r += 1

            let f = this.owner.level.enemies.filter(elem =>
                Func.checkAngle(this.owner, elem, attack_angle, weapon_angle)
            )
            let filtered_by_attack_radius = f.filter(elem =>
                Func.elipseCollision(attack_elipse, elem.getBoxElipse())
            )
            filtered_by_attack_radius.sort(
                (a, b) => Func.distance(a, this.owner) - Func.distance(b, this.owner)
            )

            filtered_by_attack_radius.forEach(elem => {
                elem.takeDamage(this.owner)
            })

            if (
                this.improved_swing_technology &&
                Func.chance(30) &&
                filtered_by_attack_radius.length
            ) {
                let status = new ImprovedSwingTechnology(this.owner.level.time)
                status.setDuration(5000)
                this.owner.level.setStatus(this.owner, status, true)
            }

            this.owner.level.addSound({
                name: 'sword swing',
                x: attack_elipse.x,
                y: attack_elipse.y,
            })

            this.echo(chance / 2, attack_angle, attack_elipse)
        }, 700)
    }
}
