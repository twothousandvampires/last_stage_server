import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class FreezeState implements IUnitState<Unit> {
    start = 0

    constructor(private duration: number = 1000) {}

    enter(unit: Unit) {
        this.start = unit.level.time

        unit.freezed = true
        unit.state = 'freezed'
        if (unit instanceof Character) {
            unit.can_be_controlled_by_player = false
        }
    }

    update(unit: Unit) {
        if (unit.level.time - this.start >= this.duration) {
            unit.getState()
        }
    }

    exit(unit: Unit) {
        if (!unit.is_dead) {
            unit.freezed = false

            if (unit instanceof Character) {
                unit.can_be_controlled_by_player = true
            }
        }
    }
}
