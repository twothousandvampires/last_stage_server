import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class StunnedState implements IUnitState<Unit> {
    start = 0

    constructor(private duration: number = 1000) {}

    enter(unit: Unit) {
        unit.state = 'stunned'

        this.start = unit.level.time

        if (unit instanceof Character) {
            unit.can_be_controlled_by_player = false
            unit.chance_to_avoid_damage_state += 100
        }
    }

    update(unit: Unit) {
        if (unit.level.time - this.start >= this.duration) {
            unit.getState()
        }
    }

    exit(unit: Unit) {
        if (unit instanceof Character) {
            unit.can_be_controlled_by_player = true
            unit.chance_to_avoid_damage_state -= 100
        }
    }
}
