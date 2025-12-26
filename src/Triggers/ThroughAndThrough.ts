import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class ThroughAndThrough implements ITrigger {

    cd: number = 1000
    last_trigger_time: number = 0
    chance: number = 120
    name: string = 'through and through'
    description: string = 'Your critical hits have a chance to damage a target behind your primary target'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Enemy) {
        if(!target) return

        let a = Func.angle(player.x, player.y, target.x, target.y)
        
        player.level.enemies.forEach(elem => {
            if(!elem.is_dead && Func.distance(elem, target) <= 9 && Func.checkAngle(target, elem, a, 0.8)){
                elem.takeDamage(player, {})
            }
        })
    }   
}