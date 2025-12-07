import IUnitState from '../Interfaces/IUnitState'
import Ancient from '../Objects/src/Enemy/Ancient'

export default class AncientIdleState implements IUnitState<Ancient> {
    start = 0
    duration = 20000
    last_change_diraction: number = 0
    angle: number = 0

    enter(enemy: Ancient) {
        this.start = enemy.level.time
        enemy.state = 'idle'
    }

    update(enemy: Ancient) {
        if (enemy.level.time - this.start >= this.duration) {
            enemy.giveRevard()
            enemy.forceLethalDamage()
        } else if (enemy.level.time - this.last_change_diraction >= 3000) {
            this.last_change_diraction = enemy.level.time
            this.angle = Math.random() * 6.28
        } else {
            enemy.moveByAngle(this.angle)
            enemy.wasChanged()
        }
    }

    exit(enemy: Ancient) {}
}
