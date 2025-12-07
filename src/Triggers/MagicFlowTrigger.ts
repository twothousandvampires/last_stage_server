import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'

export default class MagicFlowTrigger implements ITrigger {
    chance: number = 40
    name: string = 'magic flow'
    description: string = 'Gives a chance to get energy to you and allies'
    cd: number = 1000
    last_trigger_time: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if (Func.elipseCollision(box, elem.getBoxElipse())) {
                elem.addResourse(1, true)
            }
        })
    }
}
