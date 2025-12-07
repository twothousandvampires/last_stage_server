import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import HeavenRay from '../Objects/Effects/HeavenRay'
import Character from '../Objects/src/Character'

export default class DivineWeaponTrigger implements ITrigger {
    cd: number = 3000
    last_trigger_time: number = 0
    name: string = 'divine weapon'
    chance: number = 0
    description: string =
        'Gives a chance, depending on your will to rain down pillars of light on enemies when you hit'

    getTriggerChance(player: Character): number {
        return Math.round(player.will * 1.5)
    }

    trigger(player: Character, target: any) {
        let targets = []
        if(target){
            targets = player.level.enemies
            .filter(elem => !elem.is_dead && Func.distance(elem, target) <= 20)
            .slice(0, 3)
        }
        else{
            targets = player.level.enemies
            .filter(elem => !elem.is_dead && Func.distance(elem, player) <= 20)
            .slice(0, 3)
        }
    
        targets.forEach(elem => {
            elem.takeDamage(player)
            let e = new HeavenRay(player.level)
            e.setPoint(elem.x, elem.y)

            player.level.effects.push(e)
        })
    }
}
