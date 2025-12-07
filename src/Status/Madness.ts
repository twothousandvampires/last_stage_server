import Func from '../Func'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class Madness extends Status {
    target: any
    move: boolean
    in_action: boolean

    constructor(public time: number) {
        super(time)
        this.need_to_check_resist = true
        this.move = false
        this.in_action = false
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.can_be_controlled_by_player = false

            this.unit.newStatus({
                name: 'madness',
                duration: this.duration,
                desc: 'you are attacking alies',
            })
        }
    }

    act(tick_time: number) {
        this.unit.can_be_controlled_by_player = false

        if (tick_time > this.last_checked) {
            this.last_checked += 500
            if (this.unit.is_attacking) return

            if (!this.target || this?.target.is_dead) {
                this.target = this.unit.level.players.filter(
                    elem => elem != this.unit && !elem.is_dead
                )[0]
                if (!this.target) {
                    this.target = this.unit.level.enemies.filter(elem => !elem.is_dead)[0]
                }
                if (!this.target) {
                    return
                }
            }

            this.move = Func.chance(70)
            let distance = Func.distance(this.unit, this.target)
            let angle = Func.angle(this.unit.x, this.unit.y, this.target.x, this.target.y)

            if (this.move && distance > 5) {
                this.unit.angle_for_forced_movement = angle
            } else {
                this.unit.attack_angle = angle
                this.unit.useSecond()
                if (this.unit.first_ability) {
                    this.unit.first_ability.use()
                }
            }
        }
    }

    update(status: any): void {
        this.time = Date.now()
    }

    clear(): void {
        if (!this.unit.is_dead) {
            this.unit.can_be_controlled_by_player = true
        }
        this.unit.angle_for_forced_movement = undefined
    }
}
