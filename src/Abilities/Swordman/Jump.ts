import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Character from '../../Objects/src/Character'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class Jump extends SwordmanAbility implements IUnitState<Swordman> {
    start = 0
    total_jump_time: number //ms
    impact: boolean
    cost: number
    distance: number | undefined
    move_per_tick: number | undefined
    heavy_landing: boolean
    stomp: boolean
    z_add = 0.7

    constructor(owner: Swordman) {
        super(owner)
        this.total_jump_time = 1200
        this.impact = false
        this.cost = 4
        this.cd = 6500
        this.heavy_landing = false
        this.stomp = false
        this.name = 'jump'
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 40
    }

    enter(player: Character) {
        player.prepareToAction()

        this.distance = Math.sqrt((player.x - player.c_x) ** 2 + (player.y - player.c_y) ** 2)

        if (this.distance > 25) this.distance = 25
        if (this.distance < 10) this.distance = 10

        this.move_per_tick = this.distance / Math.floor(this.total_jump_time / 30)

        this.owner.state = 'jump'
        this.owner.can_be_controlled_by_player = false
        player.chance_to_avoid_damage_state += 100

        this.start = player.level.time
    }

    exit(player: Character) {
        player.z = 0
        player.chance_to_avoid_damage_state -= 100

        this.start = 0
        this.impact = false
        this.owner.can_be_controlled_by_player = true
        this.z_add = 0.7
    }

    update(player: Character) {
        if (this.impact) {
            this.afterUse()

            let second = player.getSecondResource()
            let enemies = player.level.enemies

            let attack_elipse = player.getBoxElipse()
            attack_elipse.r = player.attack_radius + (this.stomp ? 5 : 0) + second

            let filtered_by_attack_radius = enemies.filter(elem =>
                Func.elipseCollision(attack_elipse, elem.getBoxElipse())
            )
            let count = filtered_by_attack_radius.length

            filtered_by_attack_radius.forEach(elem => {
                player.addPoint()
                elem.takeDamage(player)
            })

            filtered_by_attack_radius = player.level.players.filter(
                elem => elem != player && Func.elipseCollision(attack_elipse, elem.getBoxElipse())
            )

            filtered_by_attack_radius.forEach(elem => {
                player.addPoint()
                elem.takeDamage(player)
            })

            if (this.heavy_landing) {
                player.armour_rate += count * 4
                setTimeout(() => {
                    player.armour_rate -= count * 4
                }, 5000)
            }

            player.getState()
            return
        } else {
            let delta = player.level.time - this.start
            if (delta >= this.total_jump_time) {
                this.impact = true
                return
            }
            if (delta >= this.total_jump_time / 2) {
                player.z -= this.z_add
                this.z_add += 0.02
            } else {
                player.z += this.z_add
                this.z_add -= 0.02
            }

            if (this.z_add < 0) this.z_add = 0

            let next_step_x = Math.sin(player.attack_angle) * this.move_per_tick
            let next_step_y = Math.cos(player.attack_angle) * this.move_per_tick

            if (!player.isOutOfMap(player.x + next_step_x, player.y + next_step_y)) {
                player.addToPoint(next_step_x, next_step_y)
            }
        }
    }
}
