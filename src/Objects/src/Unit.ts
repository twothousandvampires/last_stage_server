import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Level from '../../Level'
import FreezeState from '../../State/FreezeState'
import StunnedState from '../../State/StunnedState'
import ZapState from '../../State/ZapState'
import Character from './Character'
import GameObject from './GameObject'

export default abstract class Unit extends GameObject {
    move_speed_penalty: number = 0
    action_impact: number = 0
    action_end_time: number = 0
    action_is_end: boolean = false
    has_boby: boolean = true
    destroyed: boolean = false
    exploded: boolean = false
    burned: boolean = false
    can_be_instant_killed: boolean = true
    crushing: number = 0
    weapon_angle: number = 0
    is_corpse: boolean = false
    flipped: boolean = false
    is_attacking: boolean = false
    is_moving: boolean = false
    attack_angle: number | undefined = undefined
    attack_radius: number = 0
    state: string = 'none'
    move_angle: number | undefined = undefined
    stateAct: Function | undefined = undefined
    cancelAct: Function | undefined = undefined
    getStateTimer: any
    is_dead: boolean = false
    hit: boolean = false
    action: boolean = false
    attack_speed: number = 2000
    damaged: boolean = false
    action_time: number | undefined
    freezed: boolean = false
    ignited: boolean = false
    can_be_removed: boolean = true
    elemental_status_resist: number = 0

    life_status: number = 1
    armour_rate: number = 0
    stunned: boolean = false
    shocked: boolean = false
    zaped: boolean = false
    critical: number = 0

    fragility: boolean = false
    ward: number = 0
    cast_speed: number = 2000
    can_be_damaged: boolean = true
    pierce: number = 0
    immune_to_freeze = false
    immune_to_zap = false
    immune_to_stun = false
    fortify: number = 0
    power: number = 0

    current_state: IUnitState<Unit> | undefined

    constructor(level: Level) {
        super(level)
    }

    abstract getState(): void
    abstract toJSON(): object
    abstract takeDamage(unit: Unit | undefined, options: object | undefined): void

    isStatusResist() {
        return false
    }

    setImpactTime(c: number) {
        if (!this.action_time) return

        c += Func.chance(50) ? 5 : -5
        this.action_impact = this.level.time + this.action_time * (c / 100)
        this.action_end_time = this.level.time + this.action_time
    }

    checkArmour(unit: any) {
        if (this.armour_rate === 0) return false

        let p = 0

        if (unit && unit.pierce) {
            p = unit.pierce
        }

        if (p >= this.armour_rate) return false

        let arm = this.armour_rate - p

        if (arm > 95) {
            arm = 95
        }

        let check = Func.chance(arm)

        return check
    }

    getMoveSpeed(): number {
        let total_inc = this.move_speed_penalty

        if (!total_inc) return this.move_speed

        if (total_inc > 200) total_inc = 200
        if (total_inc < -95) total_inc = -95

        return this.move_speed * (1 + total_inc / 100)
    }

    addMoveSpeedPenalty(value: number) {
        this.move_speed_penalty += value
    }

    setState(newState: IUnitState<Unit>): void {
        if (this.current_state) {
            this.current_state.exit(this)
        }
        if (newState) {
            this.current_state = newState
            this.current_state.enter(this)
            this.wasChanged()
        }
    }

    moveByAngle(angle: number) {
        let a = angle

        let l = 1 - Math.abs(0.5 * Math.cos(a))

        let n_x = Math.sin(a) * l
        let n_y = Math.cos(a) * l

        let speed = this.getMoveSpeed()

        n_x *= speed
        n_y *= speed

        if (n_x < 0 && !this.is_attacking) {
            this.flipped = true
        } else if (!this.is_attacking) {
            this.flipped = false
        }

        let x_coll = false
        let y_coll = false
        let coll_e_x = undefined
        let coll_e_y = undefined

        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            return
        }

        if (!this.phasing) {
            for (let i = 0; i < this.level.enemies.length; i++) {
                let enemy = this.level.enemies[i]

                if (enemy === this) continue
                if (enemy.phasing) continue
                if (enemy.is_dead) continue

                if (Func.elipseCollision(this.getBoxElipse(n_x, 0), enemy.getBoxElipse())) {
                    x_coll = true
                    n_x = 0
                    coll_e_x = enemy
                    if (y_coll) {
                        break
                    }
                }

                if (Func.elipseCollision(this.getBoxElipse(0, n_y), enemy.getBoxElipse())) {
                    y_coll = true
                    n_y = 0
                    coll_e_y = enemy
                    if (x_coll) {
                        break
                    }
                }
            }

            if (x_coll && n_y === 0) {
                if (this.y <= coll_e_x.y) {
                    n_y = -0.4
                } else {
                    n_y = 0.4
                }
            }

            if (y_coll && n_x === 0) {
                if (this.x <= coll_e_y.x) {
                    n_x = -0.4
                } else {
                    n_x = 0.4
                }
            }
        }

        this.addToPoint(n_x, n_y)
    }

    setZap(duration: number = 0) {
        if (this.is_dead) return
        if (!this.can_be_damaged) return
        if (this.immune_to_zap) return
        if (!duration) return
        if (Func.chance(this.elemental_status_resist)) return

        this.setState(new ZapState(duration))
    }

    setStun(duration: number): void {
        if (this.is_dead) return
        if (!this.can_be_damaged) return
        if (this.immune_to_stun) return

        this.setState(new StunnedState(duration))
    }

    setFreeze(duration: number) {
        if (this.is_dead) return
        if (!this.can_be_damaged) return
        if (this.immune_to_freeze) return
        if (Func.chance(this.elemental_status_resist)) return

        if (this instanceof Character) {
            if (this.isStatusResist()) {
                this.statusWasResisted(undefined)
                return
            }
        }

        this.setState(new FreezeState(duration))
    }
}
