import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'

import Enemy from '../Objects/src/Enemy/Enemy'
import Undead from '../Objects/src/Enemy/Undead'

import UndeadRessurectState from './UndeadRessurectState'

export default class UndeadDeadState implements IUnitState<Undead> {
    start = 0
    ressurect = false

    enter(enemy: Undead) {
        this.start = enemy.level.time

        if (Func.notChance(enemy.ressurect_chance)) {
            enemy.is_corpse = true
            enemy.state = 'dead'
            enemy.action_time = enemy.dead_time

            enemy.level.check(enemy)
            enemy.whenDead()
        } else {
            enemy.state = 'dead_with_skull'
            enemy.ressurect_chance -= 10

            this.ressurect = true
        }
    }

    update(enemy: Enemy) {
        if (this.ressurect && enemy.level.time - this.start >= 3000) {
            enemy.setState(new UndeadRessurectState())
        } else if (enemy.level.time - this.start >= enemy.dead_time) {
            enemy.level.removeEnemy(enemy)
        }
    }

    exit(enemy: Enemy) {}
}
