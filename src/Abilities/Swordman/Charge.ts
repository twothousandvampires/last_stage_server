import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Character from '../../Objects/src/Character'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class Charge extends SwordmanAbility implements IUnitState<Character> {
    cost: number = 4
    distance: number = 1200
    hited: any[] = []
    destroyer: boolean
    possibilities: boolean
    start_time: number = 0

    constructor(owner: Swordman) {
        super(owner)
        this.destroyer = false
        this.possibilities = false
        this.name = 'charge'
        this.cd = 8500
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 50
    }

    impact(): void {
        
    }

    enter(player: Character) {
        player.prepareToAction()

        player.state = 'charge'
        player.action_time = 200
        player.setImpactTime(100)

        player.chance_to_avoid_damage_state += 100
    }

    update(player: Character) {
        if (this.start_time != 0) {
            if (player.level.time - this.start_time >= this.distance) {
                player.getState()
                return
            }
        }
        if (player.action || this.start_time != 0) {
            if (!this.start_time) {
                this.used = true
                this.afterUse()
                this.start_time = player.level.time
            }

            let speed = player.getMoveSpeed()

            let next_step_x = Math.sin(player.attack_angle) * speed * 1.5
            let next_step_y = Math.cos(player.attack_angle) * speed * 1.5

            if (!player.isOutOfMap(player.x + next_step_x, player.y + next_step_y)) {
                player.addToPoint(next_step_x, next_step_y)
            }

           

            let count = player.getTargetsCount()
            let second = player.getSecondResource()

            let stun_power = 2000 + (second * 100)

            player.level.enemies.forEach(elem => {
                if (
                    !this.hited.includes(elem.id) &&
                    Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.hited.push(elem.id)

                    if (count > 0 && this.destroyer && Func.chance(35 + (second * 2))) {
                        elem.takeDamage(player, {
                            explode: true,
                        })
                        count--
                    }

                    if (!elem.is_dead) {
                        elem.setStun(stun_power)
                    }

                    player.addPoint()
                }
            })

            player.level.players.forEach(elem => {
                if (
                    elem != player &&
                    !this.hited.includes(elem.id) &&
                    Func.elipseCollision(player.getBoxElipse(), elem.getBoxElipse())
                ) {
                    this.hited.push(elem.id)
                    elem.setStun(stun_power)
                    player.addPoint()
                }
            })
        }
    }

    exit(player: Character) {
        this.start_time = 0

        if (this.possibilities && this.hited.length >= 3) {
            player.addResourse()
        }

        player.chance_to_avoid_damage_state -= 100

        this.hited = []
    }
}
