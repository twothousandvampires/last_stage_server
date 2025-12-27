import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Character from '../../Objects/src/Character'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class Teleportation extends FlyerAbility implements IUnitState<Character> {
    static TELEPOR_START_STATE: number = 1
    static TELEPOR_OUT_STATE: number = 2
    static TELEPOR_END_STATE: number = 3

    state: number = Teleportation.TELEPOR_START_STATE

    teleport_x: number | undefined
    teleport_y: number | undefined

    protected: boolean = false
    increased_gate: boolean = false
    out_of_map_start: number = 0
    out_of_map_duration: number = 300

    constructor(owner: Flyer) {
        super(owner)
        this.cd = 12000
        this.name = 'teleportation'
        this.mastery_chance = 15
    }

    impact(): void {}

    use() {
        if (!this.owner.pressed.over_x || !this.owner.pressed.over_y) {
            this.owner.using_ability = undefined
            this.owner.getState()
            return
        }

        this.teleport_x = Math.round(this.owner.pressed.over_x + this.owner.x)
        this.teleport_y = Math.round(this.owner.pressed.over_y + this.owner.y)

        if (
            !this.teleport_x ||
            !this.teleport_y ||
            this.owner.isOutOfMap(this.teleport_x, this.teleport_y)
        ) {
            this.owner.using_ability = undefined
            this.owner.getState()
            return
        }

        this.owner.setState(this)
    }

    enter(unit: Flyer) {
        unit.is_attacking = true

        unit.state = 'teleport start'
        unit.level.addSound('cast', unit.x, unit.y)

        if (this.protected) {
            unit.can_be_damaged = false
        }

        unit.action_time = unit.getCastSpeed()
        unit.setImpactTime(85)
    }

    exit(unit: Flyer) {
        this.teleport_x = undefined
        this.teleport_y = undefined

        this.state = Teleportation.TELEPOR_START_STATE
        this.out_of_map_start = 0

        unit.can_be_damaged = true
        this.owner.using_ability = undefined

        unit.can_be_controlled_by_player = true
        unit.phasing = false
    }

    update(unit: Flyer) {
        if (this.state === Teleportation.TELEPOR_START_STATE) {
            if (!unit.action_is_end) return

            this.afterUse()

            unit.x = 666
            unit.y = 666
            unit.zone_id = 1

            unit.can_be_damaged = false
            unit.can_be_controlled_by_player = false
            this.state = Teleportation.TELEPOR_OUT_STATE
            this.out_of_map_start = unit.level.time

            unit.phasing = true
        } else if (this.state === Teleportation.TELEPOR_OUT_STATE) {
            if (unit.level.time - this.out_of_map_start >= this.out_of_map_duration) {
                unit.can_be_controlled_by_player = true
                unit.x = this.teleport_x
                unit.y = this.teleport_y

                unit.zone_id = 0
                unit.state = 'teleport end'
                this.state = Teleportation.TELEPOR_END_STATE
                unit.action_time = unit.getCastSpeed()
                unit.setImpactTime(100)

                let box = unit.getBoxElipse()
                box.r += 2

                if (this.increased_gate) {
                    box.r += 8
                }

                unit.level.enemies.forEach(e => {
                    if (!e.is_dead && Func.elipseCollision(box, e.getBoxElipse())) {
                        e.takeDamage(unit, {
                            explode: true,
                        })
                    }
                })
                unit.level.players.forEach(p => {
                    if (p != unit && !p.is_dead && Func.elipseCollision(box, p.getBoxElipse())) {
                        p.takeDamage(unit, {
                            explode: true,
                        })
                    }
                })
            }
        } else if (this.state === Teleportation.TELEPOR_END_STATE) {
            if (!unit.action_is_end) return

            unit.getState()
        }
    }
}
