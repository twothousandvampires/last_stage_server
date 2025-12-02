import Func from "../Func";
import IUnitState from "../Interfaces/IUnitState";
import FireExplosionSmall from "../Objects/Effects/FireExplosionSmall";
import Enemy from "../Objects/src/Enemy/Enemy";

export default class ExplodingSkullIdleState implements IUnitState<Enemy>{

    inside: boolean = false

    enter(enemy: Enemy){
        enemy.state = 'idle'
    }

    update(enemy: Enemy){

        if(!enemy.target || enemy.target?.is_dead){
            enemy.armour_rate = 0
            enemy.takePureDamage(undefined, {
                damage_value: 666
            })
        }

        let a_e = enemy.getBoxElipse()
    
        let is_collision = Func.elipseCollision(a_e, enemy.target.getBoxElipse())

        if(this.inside){
            if(enemy.action){
                enemy.invisible = true
                enemy.wasChanged()

                setTimeout(() => {
                    if(enemy.target && !enemy.target.is_dead){
                        enemy.target.armour_rate = 0
                        enemy.target.life_status = 1
                        enemy.target.takeDamage(undefined, {
                            exlode: true
                        })

                        let e = new FireExplosionSmall(enemy.level)
                        e.setPoint(enemy.target.x, enemy.target.y)

                        enemy.level.addEffect(e)

                        enemy.level.players.forEach(elem => {
                            if(Func.distance(elem, enemy.target) <= 8){
                                elem.takeDamage()
                            }
                        })
                    }

                    enemy.level.removeEnemy(enemy)
                }, 1200)
            }
        }
        else if(is_collision){
            this.inside = true
            enemy.can_be_damaged = false
            enemy.state = 'cast'
            enemy.action_time = 1200
            enemy.setImpactTime(100)
            enemy.wasChanged()
        }
        else{
           let a = enemy.retreat_angle = Func.angle(enemy.target.x, enemy.target.y, enemy.x, enemy.y)
           enemy.moveByAngle(a)
           enemy.wasChanged()
        }
    }

    exit(player: Enemy){

    }
}