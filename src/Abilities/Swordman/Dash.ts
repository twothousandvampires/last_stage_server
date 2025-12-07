import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import { Lightning } from '../../Objects/Projectiles/Lightning'
import Character from '../../Objects/src/Character'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class Dash extends SwordmanAbility implements IUnitState {
    hited: any[] = []
    start: boolean = false
    end: boolean = false
    start_time: number = 0
    electrified: boolean = false
    targets = 0
    duration = 250
    total_duration = this.duration

    constructor(owner: Swordman) {
        super(owner)
        this.name = 'dash'
        this.cd = 3000
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 7
    }

    enter(player: Character) {
        player.prepareToAction()

        player.state = 'dash'
        player.action_time = Math.floor(this.owner.cast_speed / 10)
        player.setImpactTime(100)

        player.chance_to_avoid_damage_state += 100
        player.level.addSound('holy cast', this.owner.x, this.owner.y)

        this.targets = player.getTargetsCount()

        this.total_duration = this.duration + (1500 - player.getAttackSpeed()) / 2

        if (this.total_duration < this.duration) {
            this.total_duration = this.duration
        }
    }

    exit(player: Character) {
        this.total_duration = this.duration

        if (this.electrified) {
            let count = this.hited.length

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Lightning(player.level)
                proj.setAngle(angle)
                proj.setPoint(player.x, player.y)
                proj.setOwner(player)

                player.level.projectiles.push(proj)
            }
        }

        this.targets = 0
        this.start = false
        this.end = false
        this.hited = []
        this.end = false
        this.start_time = 0
        player.chance_to_avoid_damage_state -= 100
    }

    update(player: Character) {
        if (player.action || this.start_time) {
            if (!this.start_time) {
                this.used = true
                this.afterUse()
                this.start_time = player.level.time
            }

            if (player.level.time - this.start_time >= this.total_duration) {
                player.getState()
                return
            }

            let speed = player.getMoveSpeed()

            let next_step_x = Math.sin(player.attack_angle) * speed * 1.5
            let next_step_y = Math.cos(player.attack_angle) * speed * 1.5

            if (!player.isOutOfMap(player.x + next_step_x, player.y + next_step_y)) {
                player.addToPoint(next_step_x, next_step_y)
            }

            let box = player.getBoxElipse()
            box.r = player.attack_radius

            player.level.enemies.forEach(elem => {
                if (
                    !this.hited.includes(elem) &&
                    Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.hited.push(elem)

                    if (this.targets > 0) {
                        elem.takeDamage(player)
                        this.targets--
                        player.addPoint()
                    }
                }
            })

            player.level.players.forEach(elem => {
                if (
                    elem != player &&
                    !this.hited.includes(elem) &&
                    Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.hited.push(elem)

                    if (this.targets > 0) {
                        elem.takeDamage(player)
                        this.targets--
                        player.addPoint()
                    }
                }
            })
        }
    }
}
