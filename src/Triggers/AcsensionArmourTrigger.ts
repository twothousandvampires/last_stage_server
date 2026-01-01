import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Helm from '../Objects/Effects/Helm'
import Character from '../Objects/src/Character'

export default class AcsensionArmourTrigger implements ITrigger {

    cd: number = 6000
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'ascension armour'
    description: string = 'When you block damage by armour there is a chance to create helm of ascending'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let c = new Helm(player.level)

        let a = Math.random() * 6.28

        let d = Func.random(5, 10)

        let x = player.x + Math.sin(a) * d
        let y = player.y + Math.cos(a) * d

        c.setPoint(x, y)
        player.level.binded_effects.push(c)
    }
}