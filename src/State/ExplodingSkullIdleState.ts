import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import FireExplosionSmall from '../Objects/Effects/FireExplosionSmall'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class ExplodingSkullIdleState implements IUnitState<Enemy> {
    inside: boolean = false
    inside_start_time: number = 0
    indide_duration: number = 800
    was_collison: boolean = false

    enter(enemy: Enemy) {
        enemy.state = 'idle'
    }

    update(enemy: Enemy) {
        if ((!enemy.target || enemy.target.is_dead) && !this.inside) {
            enemy.forceLethalDamage()

            return
        }

        if (this.inside) {
            if (enemy.level.time - this.inside_start_time >= this.indide_duration) {
                if (enemy.target && !enemy.target.is_dead) {
                    enemy.target.armour_rate = 0
                    enemy.target.life_status = 1
                    enemy.target.takeDamage(undefined, {
                        explode: true,
                    })

                    let e = new FireExplosionSmall(enemy.level)
                    e.setPoint(enemy.target.x, enemy.target.y)

                    enemy.level.addEffect(e)

                    enemy.level.players.forEach(elem => {
                        if (Func.distance(elem, enemy.target) <= 8) {
                            elem.takeDamage()
                        }
                    })
                }

                enemy.level.removeEnemy(enemy)
            }

            return
        }

        if (enemy.action) {
            enemy.invisible = true
            enemy.wasChanged()
            this.inside = true
            this.inside_start_time = enemy.level.time

            return
        }

        if (!this.was_collison) {
            let a_e = enemy.getBoxElipse()
            let is_collision = Func.elipseCollision(a_e, enemy.target.getBoxElipse())

            if (is_collision) {
                enemy.can_be_damaged = false
                this.was_collison = true
                enemy.state = 'cast'
                enemy.action_time = 800
                enemy.setImpactTime(100)
                enemy.wasChanged()
            } else {
                let a = (enemy.retreat_angle = Func.angle(
                    enemy.x,
                    enemy.y,
                    enemy.target.x,
                    enemy.target.y
                ))
                enemy.moveByAngle(a)
                enemy.wasChanged()
            }
        }
    }

    exit(player: Enemy) {}
}
