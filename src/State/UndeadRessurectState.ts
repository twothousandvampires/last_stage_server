import IUnitState from '../Interfaces/IUnitState'
import Undead from '../Objects/src/Enemy/Undead'

export default class UndeadRessurectState implements IUnitState<Undead> {
    start = 0

    enter(enemy: Undead) {
        enemy.state = 'ressurect'
        this.start = enemy.level.time
    }

    update(enemy: Undead) {
        if (enemy.level.time - this.start >= 2000) {
            enemy.is_dead = false
            enemy.getState()
        }
    }

    exit(player: Undead) {}
}
